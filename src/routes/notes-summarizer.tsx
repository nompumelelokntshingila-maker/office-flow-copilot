import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wand2, Eraser, Loader2, AlertTriangle, Inbox, Copy } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockSummariseNotes, type NotesSummary } from "@/lib/mock-ai";

export const Route = createFileRoute("/notes-summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and get a summary, action items, and decisions & deadlines in seconds.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into a summary, action items, and decisions.",
      },
    ],
  }),
  component: NotesSummarizerPage,
});

function BulletCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function NotesSummarizerPage() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<NotesSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (loading) return;
    if (notes.trim().length < 20) {
      setError("Please paste your meeting notes (a few lines at least) before summarising.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setResult(await mockSummariseNotes(notes));
    } catch {
      setError("Something went wrong summarising your notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    const text = [
      "SUMMARY",
      result.summary,
      "",
      "ACTION ITEMS",
      ...result.actionItems.map((item) => `• ${item}`),
      "",
      "DECISIONS & DEADLINES",
      ...result.decisions.map((item) => `• ${item}`),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Summary copied to clipboard");
    } catch {
      toast.error("Copy failed — please select the text and copy manually.");
    }
  };

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Paste your raw notes and get them split into a summary, action items, and decisions & deadlines."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <form
          className="card-surface flex flex-col gap-5 p-5 sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            void generate();
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="notes">Raw meeting notes</Label>
            <Textarea
              id="notes"
              rows={16}
              placeholder={
                "Paste your notes here — one point per line works best.\n\ne.g.\nDiscussed Q3 hiring plan\nAgreed to approve two new roles\nLerato will draft job specs by Friday"
              }
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={loading}>
              <Wand2 className="size-4" aria-hidden="true" />
              {loading ? "Summarizing..." : "Summarize"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              onClick={() => {
                setNotes("");
                setResult(null);
                setError(null);
              }}
            >
              <Eraser className="size-4" aria-hidden="true" /> Clear
            </Button>
          </div>
        </form>

        <section className="card-surface flex flex-col p-5 sm:p-6" aria-live="polite">
          <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="truncate text-base font-semibold">Structured summary</h2>
            <Button type="button" variant="outline" size="sm" onClick={copy} disabled={!result}>
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
            <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-surface p-8 text-center">
              <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
              <p className="text-sm font-medium">Summarizing your notes...</p>
            </div>
          ) : result ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-border bg-surface p-4">
                <Label htmlFor="summary-text" className="text-sm font-semibold">
                  Summary
                </Label>
                <Textarea
                  id="summary-text"
                  rows={5}
                  value={result.summary}
                  onChange={(event) =>
                    setResult((prev) => (prev ? { ...prev, summary: event.target.value } : prev))
                  }
                  className="mt-2 resize-y bg-card text-sm leading-relaxed"
                />
              </div>
              <BulletCard title="Action Items" items={result.actionItems} />
              <BulletCard title="Decisions &amp; Deadlines" items={result.decisions} />
            </div>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface p-8 text-center">
              <Inbox className="size-6 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm font-semibold">Nothing summarized yet</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Paste your meeting notes on the left and select Summarize to see the summary, action
                items, and decisions.
              </p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
