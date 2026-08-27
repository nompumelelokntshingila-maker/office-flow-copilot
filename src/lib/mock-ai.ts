/**
 * Mock AI layer.
 *
 * These functions simulate AI responses locally so the interface can be
 * reviewed before a real AI service is connected. Every response is derived
 * from the user's own input — nothing is fetched and nothing is invented
 * beyond clearly templated phrasing.
 */

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export type EmailPurpose = "request" | "follow-up" | "apology" | "announcement";
export type EmailTone = "formal" | "friendly" | "persuasive";

const GREETING: Record<EmailTone, string> = {
  formal: "Dear colleague,",
  friendly: "Hi there,",
  persuasive: "Hello,",
};

const SIGN_OFF: Record<EmailTone, string> = {
  formal: "Kind regards,",
  friendly: "Thanks so much,",
  persuasive: "Looking forward to your response,",
};

const SUBJECT: Record<EmailPurpose, string> = {
  request: "Request: ",
  "follow-up": "Following up: ",
  apology: "Apologies regarding: ",
  announcement: "Announcement: ",
};

const OPENER: Record<EmailPurpose, Record<EmailTone, string>> = {
  request: {
    formal: "I am writing to request your assistance with the matter set out below.",
    friendly: "I wanted to ask for a hand with something on my side.",
    persuasive: "I have a request that I believe will save us both time this week.",
  },
  "follow-up": {
    formal: "I am following up on our previous correspondence regarding the item below.",
    friendly: "Just circling back on this so it doesn't slip through the cracks.",
    persuasive: "I'm following up because I think this is worth moving on now.",
  },
  apology: {
    formal: "I would like to apologise for the inconvenience caused in relation to the following.",
    friendly: "I'm sorry about the mix-up — I wanted to explain what happened.",
    persuasive: "I want to apologise, and more importantly, show you how I'll put it right.",
  },
  announcement: {
    formal: "I am writing to inform you of the following update.",
    friendly: "Quick update to share with you.",
    persuasive: "I have an update that I think you'll want to act on.",
  },
};

const CLOSER: Record<EmailPurpose, string> = {
  request: "Please let me know if you are able to help, or if you need any further detail from me.",
  "follow-up": "Could you let me know where things currently stand when you have a moment?",
  apology: "Thank you for your patience — please tell me if anything further is needed from my side.",
  announcement: "Do reach out if you have any questions about this update.",
};

function firstLine(text: string) {
  const line = text
    .split(/\n|\.\s/)
    .map((part) => part.trim())
    .find((part) => part.length > 0);
  return line ?? "our discussion";
}

function bulletise(text: string) {
  return text
    .split("\n")
    .map((line) => line.replace(/^[-*•\d.\s]+/, "").trim())
    .filter((line) => line.length > 0);
}

export async function mockGenerateEmail(input: {
  context: string;
  purpose: EmailPurpose;
  tone: EmailTone;
}): Promise<string> {
  await delay(1100);
  const topic = firstLine(input.context);
  const points = bulletise(input.context).slice(1);

  const body = [
    `Subject: ${SUBJECT[input.purpose]}${topic.slice(0, 70)}`,
    "",
    GREETING[input.tone],
    "",
    OPENER[input.purpose][input.tone],
    "",
    points.length > 0
      ? `Key details:\n${points.map((point) => `• ${point}`).join("\n")}`
      : `Context: ${input.context.trim()}`,
    "",
    CLOSER[input.purpose],
    "",
    SIGN_OFF[input.tone],
    "[Your name]",
  ].join("\n");

  return body;
}

export type NotesSummary = {
  summary: string;
  actionItems: string[];
  decisions: string[];
};

export async function mockSummariseNotes(notes: string): Promise<NotesSummary> {
  await delay(1100);
  const lines = bulletise(notes);

  const actionWords = /(will|action|to do|todo|follow up|send|prepare|draft|review|assign|owner)/i;
  const decisionWords = /(decid|agreed|approved|deadline|due|by friday|by monday|sign[- ]off|budget)/i;

  const actionItems = lines.filter((line) => actionWords.test(line));
  const decisions = lines.filter((line) => decisionWords.test(line) && !actionItems.includes(line));

  const summarySource = lines.filter(
    (line) => !actionItems.includes(line) && !decisions.includes(line),
  );

  const summary =
    (summarySource.length > 0 ? summarySource : lines).slice(0, 4).join(" ") ||
    "Not enough detail in the notes to summarise.";

  return {
    summary,
    actionItems: actionItems.length > 0 ? actionItems : ["Not specified in the notes provided."],
    decisions: decisions.length > 0 ? decisions : ["Not specified in the notes provided."],
  };
}

export type PlannedTask = {
  task: string;
  priority: "High" | "Medium" | "Low";
  slot: string;
  reason: string;
};

const DAILY_SLOTS = [
  "08:30 – 10:00",
  "10:15 – 11:30",
  "11:45 – 13:00",
  "13:45 – 15:00",
  "15:15 – 16:30",
  "16:30 – 17:00",
];

const WEEKLY_SLOTS = [
  "Monday morning",
  "Monday afternoon",
  "Tuesday morning",
  "Tuesday afternoon",
  "Wednesday morning",
  "Thursday morning",
  "Thursday afternoon",
  "Friday morning",
];

export async function mockPlanTasks(
  taskText: string,
  horizon: "Daily" | "Weekly",
): Promise<PlannedTask[]> {
  await delay(1100);
  const tasks = bulletise(taskText);
  const urgent = /(urgent|asap|today|deadline|due|client|board|escalat|blocker|payroll|invoice)/i;
  const low = /(someday|nice to have|backlog|read|research|tidy|organis|organiz|optional)/i;
  const slots = horizon === "Daily" ? DAILY_SLOTS : WEEKLY_SLOTS;

  const scored = tasks.map((task, index) => {
    const priority: PlannedTask["priority"] = urgent.test(task)
      ? "High"
      : low.test(task)
        ? "Low"
        : "Medium";
    const reason = urgent.test(task)
      ? "Contains urgency or deadline wording, so it is scheduled first."
      : low.test(task)
        ? "Lower impact work that can move if the day fills up."
        : "Standard workplace task with no stated deadline — placed after urgent work.";
    return { task, priority, reason, index };
  });

  const order = { High: 0, Medium: 1, Low: 2 } as const;
  return scored
    .sort((a, b) => order[a.priority] - order[b.priority] || a.index - b.index)
    .map((item, position) => ({
      task: item.task,
      priority: item.priority,
      slot: slots[position % slots.length] ?? "Unscheduled",
      reason: item.reason,
    }));
}

export async function mockChatReply(message: string): Promise<string> {
  await delay(900);
  const text = message.toLowerCase();

  if (/email|write|draft/.test(text)) {
    return "For workplace emails, open the **Smart Email Generator** in the sidebar — give it the recipient context, a purpose and a tone, and it drafts an editable message you can refine before sending.";
  }
  if (/meeting|notes|minutes|summar/.test(text)) {
    return "Paste your raw notes into the **Notes Summarizer** and it will split them into a summary, action items, and decisions & deadlines so nothing gets lost after the meeting.";
  }
  if (/task|plan|schedul|prioriti/.test(text)) {
    return "List your tasks one per line in the **Task Planner**, choose a daily or weekly view, and you'll get a prioritised table with suggested time slots and the reasoning behind each ranking.";
  }
  if (/hello|hi|hey|good (morning|afternoon)/.test(text)) {
    return "Hello! I'm your workplace assistant. I can help with drafting messages, tidying up meeting notes, planning your day, or thinking through a work problem. What are you working on?";
  }
  if (/\?$/.test(message.trim())) {
    return `Good question. Here's how I'd approach "${message.trim()}": start by writing down the outcome you need, then list the two or three steps that actually move it forward, and park everything else. If it involves other people, agree the owner and the date before you leave the conversation.`;
  }
  return `Thanks — noted: "${message.trim()}". A practical next step is to break this into one clear owner, one deadline, and one measure of done. Tell me more and I can help you shape it, or use one of the three tools in the sidebar for a structured draft.`;
}
