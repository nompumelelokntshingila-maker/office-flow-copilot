import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks, Eraser, Loader2, AlertTriangle, Inbox, Copy } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockPlanTasks, type PlannedTask } from "@/lib/mock-ai";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "List your tasks and get a prioritised plan with High, Medium and Low priorities plus suggested time slots.",
      },
      { property: "og:title", content: "AI Task Planner | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Prioritise workplace tasks and get suggested daily or weekly time slots.",
      },
    ],
  }),
  component: TaskPlannerPage,
});

const PRIORITY_STYLES: Record<PlannedTask["priority"], string> = {
  High: "border-destructive/30 bg-destructive/10 text-destructive",
  Medium: "border-warning/40 bg-warning/15 text-warning-foreground",
  Low: "border-border bg-muted text-muted-foreground",
};

function PriorityTag({ priority }: { priority: PlannedTask["priority"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${PRIORITY_STYLES[priority]}`}
    >
      {priority} priority
    </span>
  );
}

function TaskPlannerPage() {
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState<"Daily" | "Weekly">("Daily");
  const [plan, setPlan] = useState<PlannedTask[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (loading) return;
    if (tasks.trim().length === 0) {
      setError("Add at least one task — one per line — before generating a schedule.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setPlan(await mockPlanTasks(tasks, horizon));
    } catch {
      setError("Something went wrong building your schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!plan) return;
    const text = plan
      .map((item) => `${item.priority} | ${item.slot} | ${item.task} — ${item.reason}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Schedule copied to clipboard");
    } catch {
      toast.error("Copy failed — please select the text and copy manually.");
    }
  };

  return (
    <AppShell
      title="AI Task Planner"
      description="List your tasks one per line, choose a daily or weekly view, and get a prioritised schedule."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <form
          className="card-surface flex flex-col gap-5 p-5 sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            void generate();
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="tasks">Your tasks (one per line)</Label>
            <Textarea
              id="tasks"
              rows={12}
              placeholder={
                "Send client invoice — urgent\nDraft onboarding deck\nReview supplier contract\nTidy shared drive"
              }
              value={tasks}
              onChange={(event) => setTasks(event.target.value)}
            />
          </div>

          <div className="grid gap-2 sm:max-w-56">
            <Label htmlFor="horizon">Schedule type</Label>
            <Select value={horizon} onValueChange={(value) => setHorizon(value as typeof horizon)}>
              <SelectTrigger id="horizon">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={loading}>
              <ListChecks className="size-4" aria-hidden="true" />
              {loading ? "Planning..." : "Generate Schedule"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              onClick={() => {
                setTasks("");
                setPlan(null);
                setError(null);
              }}
            >
              <Eraser className="size-4" aria-hidden="true" /> Clear
            </Button>
          </div>
        </form>

        <section className="card-surface flex flex-col p-5 sm:p-6" aria-live="polite">
          <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="truncate text-base font-semibold">Prioritised schedule</h2>
            <Button type="button" variant="outline" size="sm" onClick={copy} disabled={!plan}>
              <Copy className="size-4" aria-hidden="true" /> Copy
            </Button>
          </div>

          {error ? (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          ) : null}

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-surface p-8 text-center">
              <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
              <p className="text-sm font-medium">Prioritising your tasks...</p>
            </div>
          ) : plan ? (
            <ol className="flex flex-col gap-3">
              {plan.map((item, index) => (
                <li
                  key={`${item.task}-${index}`}
                  className="rounded-lg border border-border bg-surface p-4"
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <p className="min-w-0 text-sm font-semibold text-foreground">{item.task}</p>
                    <PriorityTag priority={item.priority} />
                  </div>
                  <p className="mt-2 text-xs font-medium text-primary">{item.slot}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {item.reason}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface p-8 text-center">
              <Inbox className="size-6 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm font-semibold">No schedule yet</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Enter your tasks on the left — one per line — pick Daily or Weekly, then select
                Generate Schedule.
              </p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
