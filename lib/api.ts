import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { z } from "zod";
import { getServerSupabase } from "./supabase-server";

// ---------------------------------------------------------------------------
// Typed error you can throw from anywhere in a handler.
// ---------------------------------------------------------------------------
export class ApiError extends Error {
  status: number;
  data?: Record<string, unknown>;

  constructor(status: number, message: string, data?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// ---------------------------------------------------------------------------
// JSON response helpers with permissive CORS headers.
// ---------------------------------------------------------------------------
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export function fail(status: number, message: string, data?: Record<string, unknown>) {
  const response: Record<string, unknown> = { error: message };
  if (data) {
    Object.assign(response, data);
  }
  return NextResponse.json(response, { status, headers: CORS_HEADERS });
}

/** Handle CORS preflight. Export as `OPTIONS` from a route if needed. */
export function preflight() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// ---------------------------------------------------------------------------
// Auth guard: returns the signed-in user + an RLS-scoped client, or throws 401.
// ---------------------------------------------------------------------------
export interface AuthContext {
  user: User;
  supabase: SupabaseClient;
}

export async function requireUser(): Promise<AuthContext> {
  const supabase = await getServerSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw new ApiError(401, "Authentication required.");
  }
  return { user, supabase };
}

// ---------------------------------------------------------------------------
// Body parsing + validation with zod.
// ---------------------------------------------------------------------------
export async function parseBody<T extends z.ZodTypeAny>(
  request: Request,
  schema: T,
): Promise<z.infer<T>> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    throw new ApiError(400, "Request body must be valid JSON.");
  }
  const result = schema.safeParse(json);
  if (!result.success) {
    const first = result.error.issues[0];
    const path = first.path.join(".");
    throw new ApiError(400, path ? `${path}: ${first.message}` : first.message);
  }
  return result.data;
}

// ---------------------------------------------------------------------------
// Wrap a handler so thrown ApiError / unexpected errors become clean JSON.
// ---------------------------------------------------------------------------
type Handler<Ctx> = (request: Request, ctx: Ctx) => Promise<NextResponse>;

export function route<Ctx>(handler: Handler<Ctx>): Handler<Ctx> {
  return async (request, ctx) => {
    try {
      return await handler(request, ctx);
    } catch (err) {
      if (err instanceof ApiError) {
        return fail(err.status, err.message, err.data);
      }
      console.error("[api] Unhandled error:", err);
      return fail(500, "Something went wrong. Please try again.");
    }
  };
}
