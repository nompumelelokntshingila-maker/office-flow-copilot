import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Copy, Eraser, Loader2, AlertTriangle, Inbox } from "lucide-react";
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
import { mockGenerateEmail, type EmailPurpose, type EmailTone } from "@/lib/mock-ai";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft professional workplace emails by choosing a purpose and tone, then edit the result before sending.",
      },
      { property: "og:title", content: "Smart Email Generator | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Generate workplace emails with a chosen purpose and tone, then edit and copy them.",
      },
    ],
  }),
  component: EmailGeneratorPage,
});

function EmailGeneratorPage() {
  const [context, setContext] = useState("");
  const [purpose, setPurpose] = useState<EmailPurpose>("request");
  const [tone, setTone] = useState<EmailTone>("formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (loading) return;
    if (context.trim().length < 5) {
      setError("Please describe the recipient and what the email is about first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setOutput(await mockGenerateEmail({ context, purpose, tone }));
    } catch {
      setError("Something went wrong generating your email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Email copied to clipboard");
    } catch {
      toast.error("Copy failed — please select the text and copy manually.");
    }
  };

  return (
    <AppShell
      title="Smart Email Generator"
      description="Describe the recipient and context, pick a purpose and tone, and get an editable draft."
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
            <Label htmlFor="context">Recipient &amp; context</Label>
            <Textarea
              id="context"
              rows={8}
              placeholder={
                "Who is it for and what is it about?\ne.g. Thandi in Finance\nNeed approval for the Q3 training budget\nQuote attached, R18 000"
              }
              value={context}
              onChange={(event) => setContext(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Put each key detail on its own line — they become bullet points in the draft.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Select value={purpose} onValueChange={(value) => setPurpose(value as EmailPurpose)}>
                <SelectTrigger id="purpose">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="request">Request</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="apology">Apology</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(value) => setTone(value as EmailTone)}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={loading}>
              <Sparkles className="size-4" aria-hidden="true" />
              {loading ? "Generating..." : "Generate Email"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              onClick={() => {
                setContext("");
                setOutput("");
                setError(null);
              }}
            >
              <Eraser className="size-4" aria-hidden="true" /> Clear
            </Button>
          </div>
        </form>

        <section className="card-surface flex flex-col p-5 sm:p-6" aria-live="polite">
          <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <Label htmlFor="email-output" className="truncate text-base font-semibold">
              Generated email
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copy}
              disabled={!output.trim()}
            >
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
              <p className="text-sm font-medium">Generating your email...</p>
            </div>
          ) : output ? (
            <Textarea
              id="email-output"
              rows={18}
              value={output}
              onChange={(event) => setOutput(event.target.value)}
              className="resize-y bg-card text-sm leading-relaxed"
            />
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface p-8 text-center">
              <Inbox className="size-6 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm font-semibold">No email generated yet</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Add the recipient and context on the left, choose a purpose and tone, then select
                Generate Email.
              </p>
            </div>
          )}

          <p className="mt-3 text-xs text-muted-foreground">
            The draft is editable — refine it before you send.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
