import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  ShieldCheck,
  Menu,
  Sparkles,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email-generator", label: "Email Generator", icon: Mail },
  { to: "/meeting-summariser", label: "Meeting Summariser", icon: NotebookPen },
  { to: "/task-planner", label: "Task Planner", icon: ListChecks },
  { to: "/about", label: "About / Responsible AI", icon: ShieldCheck },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground"
        >
          <Icon className="size-4.5 shrink-0" aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-base font-bold text-sidebar-accent-foreground">
          WorkFlow AI
        </span>
        <span className="text-xs text-sidebar-foreground/60">Productivity Assistant</span>
      </span>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="sticky top-0 hidden h-screen w-68 shrink-0 flex-col justify-between bg-sidebar p-4 lg:flex">
        <div className="flex flex-col gap-8">
          <Brand />
          <NavList />
        </div>
        <p className="rounded-lg bg-sidebar-accent/60 p-3 text-xs leading-relaxed text-sidebar-foreground/75">
          Always review AI output before sending or acting on it.
        </p>
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border bg-sidebar px-4 py-3 lg:hidden">
        <Brand />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation menu"
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-4">
            <div className="mt-6 flex flex-col gap-8">
              <Brand />
              <NavList onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        <div className="mx-auto w-full max-w-5xl">
          <div className={cn("mb-7 flex flex-col gap-1.5")}>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
            {description ? (
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
            ) : null}
          </div>
          {children}
          <footer className="mt-12 rounded-xl border border-border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Responsible AI notice:</strong>{" "}
            AI-generated content may contain errors or omissions. Always review and verify AI outputs
            before using them for workplace communication, decisions or actions. Do not enter
            confidential, sensitive or personal information unless your organisation&apos;s policies
            permit it.
          </footer>
        </div>
      </main>
    </div>
  );
}
