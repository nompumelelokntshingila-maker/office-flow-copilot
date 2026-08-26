import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Plus, Trash2, ListChecks, Eraser } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { OutputEditor } from "@/components/ai/OutputEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | WorkFlow AI" },
      {
        name: "description",
        content:
          "Enter your workplace tasks and let AI prioritise them by urgency, importance and effort, with a suggested schedule.",
      },
      { property: "og:title", content: "AI Task Planner | WorkFlow AI" },
      {
        property: "og:description",
        content: "Prioritise workplace tasks and get a suggested daily or weekly schedule.",
      },
    ],
  }),
  component: TaskPlannerPage,
});

type Task = {
  id: number;
  description: string;
  deadline: string;
  estimate: string;
  priority: string;
  notes: string;
};

const newTask = (id: number): Task => ({
  id,
  description: "",
  deadline: "",
  estimate: "",
  priority: "Medium",
  notes: "",
});

function TaskPlannerPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState<Task[]>([newTask(1)]);
  const [horizon, setHorizon] = useState<"Daily" | "Weekly">("Weekly");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (id: number, key: keyof Omit<Task, "id">, value: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, [key]: value } : t)));

  const generate = async () => {
    if (loading) return;
    const filled = tasks.filter((t) => t.description.trim().length > 0);
    if (filled.length === 0) {
      setError("Add at least one task description before generating a plan.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await run({
        data: {
          horizon,
          tasks: filled.map((t) => ({
            description: t.description,
            deadline: t.deadline,
            estimate: t.estimate,
            priority: t.priority,
            notes: t.notes,
          })),
        },
      });
      setOutput(result.text);
    } catch {
      setError("We couldn't build your plan just now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="AI Task Planner"
      description="List what's on your plate. The AI ranks tasks as High, Medium or Low priority, suggests a schedule and explains its reasoning."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void generate();
          }}
        >
          {tasks.map((task, index) => (
            <fieldset key={task.id} className="card-surface flex flex-col gap-4 p-5">
              <div className="flex items-center justify-between">
                <legend className="text-sm font-semibold text-foreground">Task {index + 1}</legend>
                {tasks.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Remove task ${index + 1}`}
                    onClick={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
                  >
                    <Trash2 className="size-4" aria-hidden="true" /> Remove
                  </Button>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`desc-${task.id}`}>Task description</Label>
                <Input
                  id={`desc-${task.id}`}
                  placeholder="e.g. Finalise the client onboarding deck"
                  value={task.description}
                  onChange={(e) => update(task.id, "description", e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor={`deadline-${task.id}`}>Deadline</Label>
                  <Input
                    id={`deadline-${task.id}`}
                    type="date"
                    value={task.deadline}
                    onChange={(e) => update(task.id, "deadline", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`estimate-${task.id}`}>Estimated time</Label>
                  <Input
                    id={`estimate-${task.id}`}
                    placeholder="e.g. 2 hours"
                    value={task.estimate}
                    onChange={(e) => update(task.id, "estimate", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`priority-${task.id}`}>Importance</Label>
                  <Select
                    value={task.priority}
                    onValueChange={(value) => update(task.id, "priority", value)}
                  >
                    <SelectTrigger id={`priority-${task.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`notes-${task.id}`}>Notes (optional)</Label>
                <Textarea
                  id={`notes-${task.id}`}
                  rows={2}
                  placeholder="e.g. Blocked until legal signs off"
                  value={task.notes}
                  onChange={(e) => update(task.id, "notes", e.target.value)}
                />
              </div>
            </fieldset>
          ))}

          <div className="card-surface flex flex-col gap-4 p-5">
            <div className="grid gap-2 sm:max-w-56">
              <Label htmlFor="horizon">Schedule type</Label>
              <Select
                value={horizon}
                onValueChange={(value) => setHorizon(value as "Daily" | "Weekly")}
              >
                <SelectTrigger id="horizon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily schedule</SelectItem>
                  <SelectItem value="Weekly">Weekly schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setTasks((prev) => [
                    ...prev,
                    newTask(Math.max(...prev.map((t) => t.id), 0) + 1),
                  ])
                }
              >
                <Plus className="size-4" aria-hidden="true" /> Add another task
              </Button>
              <Button type="submit" disabled={loading}>
                <ListChecks className="size-4" aria-hidden="true" />
                {loading ? "Planning..." : "Prioritise & plan"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={loading}
                onClick={() => {
                  setTasks([newTask(1)]);
                  setOutput("");
                  setError(null);
                }}
              >
                <Eraser className="size-4" aria-hidden="true" /> Clear all
              </Button>
            </div>
          </div>
        </form>

        <div className="xl:sticky xl:top-6 xl:self-start">
          <OutputEditor
            id="plan-output"
            label="Prioritised plan"
            value={output}
            onChange={setOutput}
            loading={loading}
            error={error}
            emptyTitle="No plan yet"
            emptyHint="Add your tasks with deadlines, estimated time and importance, then generate a prioritised plan with a suggested schedule."
            onRegenerate={() => void generate()}
            onClear={() => {
              setOutput("");
              setError(null);
            }}
            rows={24}
          />
        </div>
      </div>
    </AppShell>
  );
}
