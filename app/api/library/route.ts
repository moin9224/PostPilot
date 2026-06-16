import { z } from "zod";
import { ok, parseBody, preflight, requireUser, route } from "@/lib/api";

export const OPTIONS = () => preflight();

// GET /api/library?page=1&pageSize=20&search=&category=
export const GET = route(async (request) => {
  const { user, supabase } = await requireUser();
  const url = new URL(request.url);

  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const pageSize = Math.min(
    100,
    Math.max(1, Number(url.searchParams.get("pageSize") ?? 20)),
  );
  const search = url.searchParams.get("search")?.trim();
  const category = url.searchParams.get("category")?.trim();

  let query = supabase
    .from("content_library")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (search) query = query.ilike("content", `%${search}%`);
  if (category) query = query.eq("category", category);

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  return ok({
    items: data,
    page,
    pageSize,
    total: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  });
});

const CreateBody = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "Content is required."),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const POST = route(async (request) => {
  const { user, supabase } = await requireUser();
  const body = await parseBody(request, CreateBody);

  const { data, error } = await supabase
    .from("content_library")
    .insert({
      user_id: user.id,
      title: body.title ?? null,
      content: body.content,
      category: body.category ?? null,
      tags: body.tags ?? null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return ok({ item: data }, 201);
});
