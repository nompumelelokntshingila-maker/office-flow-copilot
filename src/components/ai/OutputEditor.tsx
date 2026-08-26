import { Copy, RefreshCw, Eraser, Loader2, AlertTriangle, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function OutputEditor({
  id,
  label,
  value,
  onChange,
  loading,
  error,
  emptyTitle,
  emptyHint,
  onRegenerate,
  onClear,
  rows = 18,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
  error: string | null;
  emptyTitle: string;
  emptyHint: string;
  onRegenerate: () => void;
  onClear: () => void;
  rows?: number;
}) {
  const hasOutput = value.trim().length > 0;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed — please select the text and copy manually.");
    }
  };

  return (
    <section className="card-surface flex flex-col p-5 sm:p-6" aria-live="polite">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Label htmlFor={id} className="text-base font-semibold">
          {label}
        </Label>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={copy} disabled={!hasOutput}>
            <Copy className="size-4" aria-hidden="true" /> Copy
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={loading}
          >
            <RefreshCw className="size-4" aria-hidden="true" /> Regenerate
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={loading || !hasOutput}
          >
            <Eraser className="size-4" aria-hidden="true" /> Clear
          </Button>
        </div>
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
          <p className="text-sm font-medium text-foreground">AI is generating your response...</p>
          <p className="text-xs text-muted-foreground">This usually takes a few seconds.</p>
        </div>
      ) : hasOutput ? (
        <Textarea
          id={id}
          value={value}
          rows={rows}
          onChange={(event) => onChange(event.target.value)}
          className="resize-y bg-card font-sans text-sm leading-relaxed"
          aria-describedby={`${id}-help`}
        />
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface p-8 text-center">
          <Inbox className="size-6 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-semibold text-foreground">{emptyTitle}</p>
          <p className="max-w-sm text-xs text-muted-foreground">{emptyHint}</p>
        </div>
      )}

      <p id={`${id}-help`} className="mt-3 text-xs text-muted-foreground">
        This output is fully editable — refine it before you use it.
      </p>
    </section>
  );
}
