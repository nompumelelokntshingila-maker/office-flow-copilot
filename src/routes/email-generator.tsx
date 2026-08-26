import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Send, Eraser } from "lucide-react";
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
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | WorkFlow AI" },
      {
        name: "description",
        content:
          "Draft professional workplace emails with a chosen tone and length, then edit the result before sending.",
      },
      { property: "og:title", content: "Smart Email Generator | WorkFlow AI" },
      {
        property: "og:description",
        content: "Generate clear, professional workplace emails and edit them before sending.",
      },
    ],
  }),
  component: EmailGeneratorPage,
});

const EMPTY = {
  recipient: "",
  purpose: "",
  keyPoints: "",
  tone: "Formal" as "Formal" | "Friendly" | "Persuasive",
  length: "Standard" as "Concise" | "Standard" | "Detailed",
  extra: "",
};

function EmailGeneratorPage() {
  const run = useServerFn(generateEmail);
  const [form, setForm] = useState(EMPTY);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const generate = async () => {
    if (loading) return;
    if (!form.recipient.trim() || !form.purpose.trim() || !form.keyPoints.trim()) {
      setError("Please fill in the recipient, email purpose and key points first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: form });
      setOutput(result.text);
    } catch {
      setError("We couldn't generate your email just now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Smart Email Generator"
      description="Give the AI the facts and it drafts a professional email — subject line included. Nothing is invented beyond what you provide."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <form
          className="card-surface flex flex-col gap-5 p-5 sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            void generate();
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="e.g. Thandi Mokoena, Finance Manager"
              value={form.recipient}
              onChange={(e) => set("recipient", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="purpose">Email purpose</Label>
            <Input
              id="purpose"
              placeholder="e.g. Request approval for the Q3 training budget"
              value={form.purpose}
              onChange={(e) => set("purpose", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="keyPoints">Key points / information</Label>
            <Textarea
              id="keyPoints"
              rows={6}
              placeholder="One point per line — dates, amounts, names, next steps."
              value={form.keyPoints}
              onChange={(e) => set("keyPoints", e.target.value)}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="tone">Tone</Label>
              <Select
                value={form.tone}
                onValueChange={(value) => set("tone", value as typeof form.tone)}
              >
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="length">Length</Label>
              <Select
                value={form.length}
                onValueChange={(value) => set("length", value as typeof form.length)}
              >
                <SelectTrigger id="length">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Concise">Concise</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="extra">Additional instructions (optional)</Label>
            <Textarea
              id="extra"
              rows={3}
              placeholder="e.g. Mention that I'm available for a call on Thursday."
              value={form.extra}
              onChange={(e) => set("extra", e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={loading}>
              <Send className="size-4" aria-hidden="true" />
              {loading ? "Generating..." : "Generate email"}
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
          id="email-output"
          label="Generated email"
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          emptyTitle="No email generated yet"
          emptyHint="Add the recipient, the purpose of the email and your key points, then choose a tone and length to generate a draft."
          onRegenerate={() => void generate()}
          onClear={() => {
            setOutput("");
            setError(null);
          }}
        />
      </div>
    </AppShell>
  );
}
