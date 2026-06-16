import {
  Activity,
  BarChart3,
  CalendarClock,
  CalendarDays,
  Eye,
  FileText,
  Heart,
  LayoutDashboard,
  Library,
  Radio,
  Send,
  Settings,
  Sparkles,
  Stethoscope,
  UserPlus,
  Users,
  UsersRound,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

const MAP: Record<string, ComponentType<LucideProps>> = {
  Activity,
  BarChart3,
  CalendarClock,
  CalendarDays,
  Eye,
  FileText,
  Heart,
  LayoutDashboard,
  Library,
  Radio,
  Send,
  Settings,
  Sparkles,
  Stethoscope,
  UserPlus,
  Users,
  UsersRound,
};

export default function Icon({
  name,
  ...props
}: { name: string } & LucideProps) {
  const Cmp = MAP[name] ?? Sparkles;
  return <Cmp {...props} />;
}
