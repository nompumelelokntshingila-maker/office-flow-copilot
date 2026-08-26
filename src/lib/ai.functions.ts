import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runPrompt } from "./ai-run.server";
import { buildEmailPrompt, buildMeetingPrompt, buildTaskPrompt } from "./ai-prompts";

const emailSchema = z.object({
  recipient: z.string().min(1),
  purpose: z.string().min(1),
  keyPoints: z.string().min(1),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
  length: z.enum(["Concise", "Standard", "Detailed"]),
  extra: z.string().optional(),
});

const meetingSchema = z.object({
  title: z.string().optional().default(""),
  date: z.string().optional().default(""),
  participants: z.string().optional().default(""),
  notes: z.string().min(20),
});

const taskSchema = z.object({
  horizon: z.enum(["Daily", "Weekly"]),
  tasks: z
    .array(
      z.object({
        description: z.string().min(1),
        deadline: z.string().optional(),
        estimate: z.string().optional(),
        priority: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .min(1),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => emailSchema.parse(input))
  .handler(async ({ data }) => runPrompt(buildEmailPrompt(data)));

export const summariseMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => meetingSchema.parse(input))
  .handler(async ({ data }) => runPrompt(buildMeetingPrompt(data)));

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => taskSchema.parse(input))
  .handler(async ({ data }) => runPrompt(buildTaskPrompt(data.tasks, data.horizon)));
