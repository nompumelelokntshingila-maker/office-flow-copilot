import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Mail, NotebookPen, ListChecks, MessagesSquare, ShieldCheck, Bot } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Email Generator", icon: Mail },
  { to: "/notes-summarizer", label: "Notes Summarizer", icon: NotebookPen },
  { to: "/task-planner", label: "Task Planner", icon: ListChecks },
  { to: "/chatbot", label: "Chatbot", icon: MessagesSquare },
] as const;

function ResponsibleAiDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full border-primary/25 bg-primary-soft text-primary hover:bg-primary-soft"
        >
          <ShieldCheck className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Responsible AI Use</span>
          <span className="sm:hidden">Responsible AI</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Responsible AI use</DialogTitle>
          <DialogDescription>
            How to work safely with the assistant's output.
          </DialogDescription>
        </DialogHeader>
        <ul className="flex list-disc flex-col gap-2.5 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            AI-generated content may be inaccurate or incomplete. Always review and verify it before
            sending, sharing or acting on it.
          </li>
          <li>
            Do not enter confidential, sensitive or personal information unless your organisation's
            policies allow it.
          </li>
          <li>
            The assistant supports your judgement — it does not replace human decision-making, and
            you remain responsible for anything you send.
          </li>
          <li>
            Responses in this preview are generated locally as placeholders while the interface is
            being reviewed.
          </li>
        </ul>
      </DialogContent>
    </Dialog>
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
  const [, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col gap-6 border-r border-sidebar-border bg-sidebar px-2 py-4 lg:w-64 lg:px-3">
        <div className="flex items-center justify-center gap-2.5 lg:justify-start lg:px-1">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Bot className="size-5" aria-hidden="true" />
          </span>
          <span className="hidden min-w-0 flex-col leading-tight lg:flex">
            <span className="truncate font-display text-sm font-bold text-sidebar-accent-foreground">
              AI Workplace
            </span>
            <span className="truncate text-xs text-sidebar-foreground/60">
              Productivity Assistant
            </span>
          </span>
        </div>

        <nav aria-label="Tools" className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              title={label}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: to === "/" }}
              className="flex items-center justify-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground lg:justify-start lg:px-3"
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="hidden truncate lg:inline">{label}</span>
              <span className="sr-only lg:hidden">{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur sm:px-6">
          <span className="truncate font-display text-sm font-bold text-foreground sm:text-base">
            AI Workplace Productivity Assistant
          </span>
          <ResponsibleAiDialog />
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <div className="mb-6 flex flex-col gap-1.5">
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
              {description ? (
                <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
            {children}
            <footer className="mt-10 rounded-xl border border-border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
              AI-generated content may be inaccurate. Review all output before using it for
              workplace communication or decisions.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
