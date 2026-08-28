# WorkFlow AI

Build a complete, polished, responsive web application called "WorkFlow AI – Workplace Productivity Assistant".

IMPORTANT:

This is a single integrated AI productivity platform, NOT three separate applications. The three AI features must feel connected and share the same design system and user experience.

GOAL:

Create a professional SaaS-style workplace productivity dashboard that helps employees save time by using AI to generate professional emails, summarise meeting notes, and organise/prioritise workplace tasks.

TARGET USERS:

Professionals, employees, managers, administrators, and students who need help managing everyday workplace communication and tasks.

CORE FEATURES:

Implement exactly these 3 main AI-powered features:

1. SMART EMAIL GENERATOR

Create a page where the user can generate professional workplace emails.

INPUTS:

- Recipient

- Email purpose

- Key points/information

- Tone dropdown: Formal, Friendly, Persuasive

- Length dropdown: Concise, Standard, Detailed

- Optional additional instructions

FUNCTIONALITY:

- Generate an AI-written email using the user's inputs.

- Include an appropriate subject line.

- Allow the generated email to be edited directly.

- Include Copy and Regenerate buttons.

- Include Clear button to reset the form.

- The AI must not invent important facts that the user did not provide.

- Keep workplace language professional and appropriate.

2. MEETING NOTES SUMMARISER

Create a page where users can paste or enter long meeting notes.

INPUT:

- Meeting title

- Meeting date

- Participants

- Meeting notes

OUTPUT:

Organise the AI-generated result into clearly separated sections:

- Meeting Summary

- Key Decisions

- Action Items

- Deadlines

- Important Points

For action items, use a structured format containing:

- Task

- Person responsible, if mentioned

- Deadline, if mentioned

FUNCTIONALITY:

- Allow the output to be edited.

- Include Copy button.

- Include Regenerate button.

- Include Clear button.

- Do not invent decisions, deadlines, names, or responsibilities that are not present in the notes.

- If information is missing, clearly indicate "Not specified".

3. AI TASK PLANNER

Create a page where users can enter their workplace tasks and use AI to prioritise and organise them.

INPUTS:

- Task description

- Deadline

- Estimated time required

- Priority/importance

- Optional notes

FUNCTIONALITY:

- Allow multiple tasks to be entered.

- Use AI to prioritise tasks based on urgency, deadline, importance and estimated effort.

- Categorise tasks as High, Medium or Low priority.

- Generate a suggested daily or weekly schedule.

- Clearly explain why tasks were prioritised.

- Allow users to edit tasks after the AI generates the plan.

- Include Copy, Regenerate and Clear controls.

DASHBOARD:

Create a professional landing/dashboard page showing:

- Welcome message

- Short explanation of what WorkFlow AI does

- Three feature cards:

  1. Smart Email Generator

  2. Meeting Notes Summariser

  3. AI Task Planner

- Brief description for each feature

- "Get Started" buttons

- A small productivity overview section showing example statistics such as:

  Emails generated

  Meetings summarised

  Tasks planned

Use mock/example statistics only; do not claim these are real user statistics unless actual data is being stored.

NAVIGATION:

Create a persistent left sidebar on desktop with:

- Dashboard

- Email Generator

- Meeting Summariser

- Task Planner

- About / Responsible AI

On mobile, convert the sidebar into a responsive hamburger/menu navigation.

DESIGN:

Use a clean, modern, professional SaaS dashboard aesthetic.

Design requirements:

- Professional workplace appearance

- Minimal and uncluttered interface

- Clear typography

- Consistent spacing

- Rounded cards

- Subtle shadows

- Clear buttons and form labels

- Strong visual hierarchy

- Attractive but not overly colourful

- Avoid childish, cartoon-like or overly futuristic design

- Use a consistent professional colour palette

- Use icons where appropriate

- Make the interface feel like a real productivity software product

RESPONSIVE DESIGN:

The application must work properly on:

- Desktop

- Tablet

- Mobile

Ensure cards, forms, navigation, tables and AI outputs adapt correctly to smaller screens.

AI PROMPT ENGINEERING:

Use structured prompts for each AI feature.

The prompts should:

- Clearly define the AI's role

- Clearly define the task

- Include the user's input

- Specify the desired output format

- Specify tone and style where relevant

- Prevent the AI from fabricating information

- Tell the AI to indicate when information is missing

- Produce structured, useful and professional outputs

Do not expose technical prompt instructions to normal users unless there is an appropriate "How AI works" section.

EDITABLE AI OUTPUTS:

All generated AI content must appear in editable fields or editable content areas so the user can review and modify the output before using it.

RESPONSIBLE AI:

Add a clearly visible but unobtrusive Responsible AI disclaimer in the application.

Use wording similar to:

"AI-generated content may contain errors or omissions. Always review and verify AI outputs before using them for workplace communication, decisions or actions. Do not enter confidential, sensitive or personal information unless your organisation's policies permit it."

Create an "About / Responsible AI" page explaining:

- AI outputs should be reviewed by humans.

- AI can make mistakes or produce inaccurate information.

- Users should avoid entering confidential or sensitive workplace information.

- AI should support human decision-making, not replace human judgement.

- Users remain responsible for reviewing generated content.

ERROR HANDLING:

If an AI request fails, show a clear and friendly error message and allow the user to try again.

EMPTY STATES:

When no content has been generated yet, show helpful empty-state messages explaining what the user should enter.

LOADING STATES:

When AI is generating a response, show a professional loading indicator such as "AI is generating your response..." and prevent confusing duplicate submissions.

ACCESSIBILITY:

- Use clear labels for all form inputs.

- Maintain readable contrast.

- Use keyboard-accessible buttons and controls.

- Do not rely only on colour to communicate meaning.

TECHNICAL QUALITY:

Build the application as a functional web application rather than a static mock-up.

Use reusable components where appropriate.

Keep the code organised and maintainable.

Use realistic sample data only where necessary for demonstrating the interface.

Do not create fake AI responses that look like real AI functionality if the feature is intended to call an AI service.

IMPORTANT UI DETAIL:

The dashboard should make it immediately obvious what the three main AI tools do.

The user should be able to reach any of the three features within one or two clicks from the dashboard.

FINAL RESULT:

The finished application should look like a polished, portfolio-ready workplace SaaS product that could realistically be demonstrated to an employer.

Before finishing, check that:

- All 3 AI features are accessible.

- Navigation works.

- Forms work.

- AI outputs are displayed clearly.

- Outputs are editable.

- Copy/regenerate/clear actions work.

- Responsive layout works on desktop and mobile.

- Responsible AI disclaimer is visible.

- No major buttons or navigation items are placeholders.

- The overall design is consistent across every page.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://office-flow-copilot.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/16e9166c-99d6-4993-b4fa-0dcd334f3ebb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
