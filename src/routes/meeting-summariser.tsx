import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Wand2, Eraser } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { OutputEditor } from "@/components/ai/OutputEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summariseMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/meeting-summariser")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summariser | WorkFlow AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into a structured summary with decisions, action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summariser | WorkFlow AI" },
      {
        property: "og:description",
        content: "Structured meeting summaries with decisions, owners and deadlines.",
      },
    ],
  }),
  component: MeetingSummariserPage,
});

const EMPTY = { title: "", date: "", participants: "", notes: "" };

function MeetingSummariserPage() {
  const run = useServerFn(summariseMeeting);
  const [form, setForm] = useState(EMPTY);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof EMPTY, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const generate = async () => {
    if (loading) return;
    if (form.notes.trim().length < 20) {
      setError("Please paste your meeting notes (at least a couple of sentences) first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: form });
      setOutput(result.text);
    } catch {
      setError("We couldn't summarise your notes just now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Meeting Notes Summariser"
      description="Paste raw notes and get a structured record: summary, decisions, action items, deadlines and important points. Missing details are marked “Not specified”."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <form
          className="card-surface flex flex-col gap-5 p-5 sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            void generate();
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Meeting title</Label>
              <Input
                id="title"
                placeholder="e.g. Weekly operations sync"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Meeting date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="participants">Participants</Label>
            <Input
              id="participants"
              placeholder="e.g. Sipho, Lerato, Daniel, Fatima"
              value={form.participants}
              onChange={(e) => set("participants", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Meeting notes</Label>
            <Textarea
              id="notes"
              rows={14}
              placeholder="Paste your raw notes here — bullet points, shorthand and rough sentences are fine."
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={loading}>
              <Wand2 className="size-4" aria-hidden="true" />
              {loading ? "Summarising..." : "Summarise notes"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              onClick={() => {
                setForm(EMPTY);
                setOutput("");
                setError(null);
              }}
            >
              <Eraser className="size-4" aria-hidden="true" /> Clear form
            </Button>
          </div>
        </form>

        <OutputEditor
          id="meeting-output"
          label="Structured meeting record"
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          emptyTitle="No summary yet"
          emptyHint="Add the meeting title, date and participants, paste your notes, then generate a structured summary with decisions, action items and deadlines."
          onRegenerate={() => void generate()}
          onClear={() => {
            setOutput("");
            setError(null);
          }}
          rows={22}
        />
      </div>
    </AppShell>
  );
}
