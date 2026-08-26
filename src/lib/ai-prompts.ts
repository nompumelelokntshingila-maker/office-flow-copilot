export type EmailInput = {
  recipient: string;
  purpose: string;
  keyPoints: string;
  tone: "Formal" | "Friendly" | "Persuasive";
  length: "Concise" | "Standard" | "Detailed";
  extra?: string;
};

export type MeetingInput = {
  title: string;
  date: string;
  participants: string;
  notes: string;
};

export type TaskInput = {
  description: string;
  deadline?: string;
  estimate?: string;
  priority?: string;
  notes?: string;
};

const NO_FABRICATION =
  "Strict rules: never invent facts, names, numbers, dates, commitments or context that the user did not provide. If a detail is missing, write \"Not specified\" or leave a clearly marked placeholder in square brackets. Keep language professional and appropriate for a workplace. Output plain text only (no markdown code fences).";

export function buildEmailPrompt(input: EmailInput) {
  const lengthGuide = {
    Concise: "roughly 60-100 words, 1-2 short paragraphs",
    Standard: "roughly 120-180 words, 2-3 paragraphs",
    Detailed: "roughly 220-320 words, 3-4 paragraphs",
  }[input.length];

  return `You are an experienced workplace communication assistant who writes clear, professional business emails.

TASK: Write one complete email based only on the information supplied below.

INPUT
Recipient: ${input.recipient || "Not specified"}
Purpose of the email: ${input.purpose || "Not specified"}
Key points to include: ${input.keyPoints || "Not specified"}
Tone: ${input.tone}
Length: ${input.length} (${lengthGuide})
Additional instructions: ${input.extra?.trim() || "None"}

OUTPUT FORMAT (exactly this shape, no extra commentary):
Subject: <a specific, informative subject line>

<greeting>

<email body paragraphs>

<professional sign-off>
[Your name]

STYLE: ${input.tone.toLowerCase()} tone throughout, natural sentences, no filler, no emoji.
${NO_FABRICATION}`;
}

export function buildMeetingPrompt(input: MeetingInput) {
  return `You are a meticulous meeting-notes analyst. You summarise raw notes without adding anything that is not in them.

TASK: Read the meeting notes and produce a structured record.

INPUT
Meeting title: ${input.title || "Not specified"}
Date: ${input.date || "Not specified"}
Participants: ${input.participants || "Not specified"}
Raw notes:
"""
${input.notes}
"""

OUTPUT FORMAT (use these exact section headings, plain text, no markdown fences):
MEETING SUMMARY
<3-6 sentence overview>

KEY DECISIONS
- <decision> (or "Not specified" if none were recorded)

ACTION ITEMS
- Task: <task> | Owner: <person or "Not specified"> | Deadline: <deadline or "Not specified">

DEADLINES
- <date or timeframe>: <what is due> (or "Not specified")

IMPORTANT POINTS
- <risk, blocker, open question or noteworthy detail>

${NO_FABRICATION} Never infer an owner or deadline that is not explicitly stated in the notes.`;
}

export function buildTaskPrompt(tasks: TaskInput[], horizon: "Daily" | "Weekly") {
  const list = tasks
    .map(
      (t, i) =>
        `${i + 1}. Task: ${t.description}\n   Deadline: ${t.deadline || "Not specified"}\n   Estimated time: ${t.estimate || "Not specified"}\n   User-stated importance: ${t.priority || "Not specified"}\n   Notes: ${t.notes?.trim() || "None"}`,
    )
    .join("\n");

  return `You are a pragmatic workplace productivity coach who prioritises task lists.

TASK: Prioritise the tasks below using urgency (deadline), importance and estimated effort, then propose a realistic ${horizon.toLowerCase()} schedule.

TASK LIST
${list}

OUTPUT FORMAT (use these exact section headings, plain text, no markdown fences):
PRIORITISED TASKS
HIGH PRIORITY
- <task> - Effort: <estimate or "Not specified"> - Due: <deadline or "Not specified">
MEDIUM PRIORITY
- ...
LOW PRIORITY
- ...

SUGGESTED ${horizon.toUpperCase()} SCHEDULE
<time block or day>: <task(s)>

WHY THESE PRIORITIES
- <task>: <one clear sentence explaining the ranking based on deadline, importance and effort>

If a section has no tasks, write "None". ${NO_FABRICATION} Do not add tasks the user did not list, and do not assume deadlines.`;
}
