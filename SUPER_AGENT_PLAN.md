# Super Agent — Implementation Plan

## Vision

A unified AI-powered personal assistant that lives in two places:

1. **Canvas Mode (Resume Editor)** — embedded in the resume editor as a side panel that can generate/edit HTML resume artifacts in real-time
2. **Standalone Page (`/dashboard/agent`)** — a full-page agent workspace with artifact panel, covering resumes, cover letters, emails, translations, and more

The agent has **full user context** (profile, past activity, resumes, cover letters, emails), uses **OpenAI function calling** for tool use, renders **editable HTML artifacts** in a side panel, and can export to **PDF**.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Super Agent Page                   │
│  /dashboard/agent                                    │
│                                                      │
│  ┌──────────────────┐  ┌──────────────────────────┐ │
│  │   Chat Panel      │  │   Artifact Panel         │ │
│  │                    │  │                          │ │
│  │  - Messages        │  │  - HTML Preview (iframe) │ │
│  │  - Tool calls      │  │  - Edit mode (TipTap)   │ │
│  │  - Suggestions     │  │  - Export to PDF         │ │
│  │  - History         │  │  - Download              │ │
│  │                    │  │  - Translate              │ │
│  └──────────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## Phase 1: Core Agent Backend (API + Tools)

### 1.1 — Create Super Agent API Route
- **File**: `app/api/super-agent/route.ts`
- Streaming endpoint using Vercel AI SDK + OpenAI
- System prompt with full user context injection
- Tool definitions via OpenAI function calling
- Multi-step tool execution (max 10 steps)

### 1.2 — Define Agent Tools (OpenAI Function Calling)
- **File**: `lib/super-agent/tools.ts`

| Tool | Description |
|------|-------------|
| `get_user_profile` | Fetch user profile (name, skills, experience, education) |
| `get_resumes` | List user's resumes with summaries |
| `get_resume_detail` | Fetch full resume content by ID |
| `get_cover_letters` | List user's cover letters |
| `get_cover_letter_detail` | Fetch full cover letter by ID |
| `get_follow_up_emails` | List user's follow-up emails |
| `get_email_detail` | Fetch full email by ID |
| `get_saved_jobs` | Fetch user's saved jobs for context |
| `create_html_artifact` | Generate an HTML artifact (resume, cover letter, email) and display in artifact panel |
| `update_html_artifact` | Modify the current artifact HTML |
| `translate_artifact` | Translate the current artifact to a specified language |
| `create_resume` | Save a new resume to the database |
| `update_resume` | Update an existing resume in the database |
| `create_cover_letter` | Save a new cover letter to the database |
| `create_follow_up_email` | Save a new follow-up email to the database |
| `score_resume` | Run ATS scoring on a resume |
| `search_jobs` | Search for relevant jobs |

### 1.3 — User Context Loader
- **File**: `lib/super-agent/context.ts`
- Aggregates: profile, recent resumes (last 5), recent cover letters, recent emails, saved jobs
- Builds a concise system prompt section so the agent "knows" the user
- Cached per session to avoid repeated DB calls

### 1.4 — Agent System Prompt
- **File**: `lib/super-agent/prompt.ts`
- Role: "You are the user's personal career assistant"
- Capabilities summary (what tools are available)
- User context block (injected dynamically)
- Output rules: when to create artifacts, formatting standards
- Artifact rules: always produce complete, self-contained HTML documents
- Language: match user's language or translate on request

---

## Phase 2: Artifact System

### 2.1 — Artifact Types
- **File**: `lib/super-agent/artifact-types.ts`

```typescript
type ArtifactType = 'resume' | 'cover_letter' | 'email' | 'document'

interface Artifact {
  id: string
  type: ArtifactType
  title: string
  html: string
  language: string
  createdAt: Date
  updatedAt: Date
}
```

### 2.2 — Artifact Renderer Component
- **File**: `components/super-agent/artifact-panel.tsx`
- Split into two modes:
  - **Preview Mode**: Sandboxed iframe rendering the HTML artifact
  - **Edit Mode**: TipTap rich-text editor loaded with the artifact HTML
- Toolbar actions:
  - Toggle Preview / Edit
  - Download as PDF (html2pdf.js or print-to-pdf)
  - Download as HTML
  - Copy to clipboard
  - Save to database (resume/cover letter/email)
  - Translate (language selector dropdown)
  - Full-screen toggle

### 2.3 — HTML Artifact Templates
- **File**: `lib/super-agent/artifact-templates.ts`
- Base HTML/CSS templates the agent uses as starting points:
  - Professional Resume (clean, ATS-friendly)
  - Creative Resume (modern, colorful)
  - Formal Cover Letter (business format)
  - Casual Cover Letter (startup-friendly)
  - Follow-Up Email (clean, concise)
  - General Document (flexible)
- Each template is a function: `(content, options) => string` returning full HTML

### 2.4 — PDF Export
- **File**: `lib/super-agent/pdf-export.ts`
- Use `html2pdf.js` client-side or server-side puppeteer fallback
- Preserves styling from the HTML artifact
- A4/Letter size options

---

## Phase 3: Standalone Agent Page (`/dashboard/agent`)

### 3.1 — Page & Layout
- **File**: `app/(autoTalent-app)/dashboard/agent/page.tsx`
- Two-panel resizable layout (like existing resume editor)
- Left: Chat panel | Right: Artifact panel
- Mobile: stacked with tab switching

### 3.2 — Chat Panel Component
- **File**: `components/super-agent/chat-panel.tsx`
- Message list with streaming support
- Tool call indicators (loading states for each tool)
- Quick action buttons above input:
  - "Build me a resume"
  - "Write a cover letter"
  - "Draft a follow-up email"
  - "Translate this to..."
  - "Score my resume"
- File/image upload support (for importing existing documents)
- Conversation history (stored in localStorage or DB)

### 3.3 — Agent State Management
- **File**: `components/super-agent/use-super-agent.ts` (custom hook)
- Manages: messages, current artifact, tool execution state, loading states
- Uses Vercel AI SDK `useChat` with tool handling
- Artifact state synced between chat and artifact panel

### 3.4 — Navigation Integration
- Add "AI Agent" to sidebar navigation (`components/sidebar.tsx`)
- Icon: sparkles/brain icon
- Position: near the top, after Dashboard

---

## Phase 4: Canvas Integration (Resume Editor)

### 4.1 — Agent Side Panel in Resume Editor
- **File**: `components/resume/editor/agent-side-panel.tsx`
- Collapsible panel on the right side of the resume editor
- Toggle button with agent icon
- Shares the same chat + artifact logic but:
  - Pre-loaded with the current resume context
  - Artifact changes can be applied directly to the resume
  - "Apply to resume" button that maps HTML changes back to resume fields

### 4.2 — Resume ↔ Artifact Sync
- **File**: `lib/super-agent/resume-sync.ts`
- Convert resume data → HTML artifact (using templates)
- Parse HTML artifact → resume data (structured extraction)
- Diff detection to show what changed

---

## Phase 5: Translation & Language Support

### 5.1 — Translation Tool
- **File**: `lib/super-agent/translation.ts`
- Uses OpenAI to translate artifact content
- Preserves HTML structure, only translates text nodes
- Supports 30+ languages
- Language detection for auto-suggestions

### 5.2 — Multi-Language Artifact Generation
- Agent can generate artifacts in any language from the start
- Language selector in artifact panel toolbar
- "Translate" button triggers translation tool

---

## Phase 6: Polish & UX

### 6.1 — Conversation Persistence
- Store agent conversations in Supabase (new `agent_conversations` table)
- Resume conversations across sessions
- Conversation list in sidebar of agent page

### 6.2 — Artifact History
- Version history for artifacts (undo/redo)
- "Revert to version" capability
- Show diff between versions

### 6.3 — Smart Suggestions
- Based on user's profile completeness, suggest next actions
- "Your resume doesn't mention X skill from your profile"
- "You have a saved job at Company Y — want a tailored cover letter?"

### 6.4 — Keyboard Shortcuts
- `Cmd+Enter` — Send message
- `Cmd+E` — Toggle edit mode on artifact
- `Cmd+S` — Save artifact
- `Cmd+P` — Export to PDF
- `Cmd+Shift+T` — Translate artifact

---

## Database Changes

### New Tables

```sql
-- Agent conversations
CREATE TABLE agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  messages JSONB DEFAULT '[]',
  current_artifact JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Artifacts
CREATE TABLE artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES agent_conversations(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('resume', 'cover_letter', 'email', 'document')),
  title TEXT,
  html TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
```

---

## New Dependencies

| Package | Purpose |
|---------|---------|
| `html2pdf.js` | Client-side PDF generation from HTML artifacts |
| (already have) `@tiptap/*` | Rich text editing for artifact edit mode |
| (already have) `ai` | Vercel AI SDK for streaming |
| (already have) `openai` | OpenAI API client |
| (already have) `react-resizable-panels` | Split panel layout |

---

## File Structure (New Files)

```
lib/super-agent/
├── tools.ts              # Tool definitions for OpenAI function calling
├── context.ts            # User context aggregation
├── prompt.ts             # System prompt builder
├── artifact-types.ts     # TypeScript types
├── artifact-templates.ts # HTML templates for artifacts
├── pdf-export.ts         # PDF generation utility
├── translation.ts        # Translation utility
└── resume-sync.ts        # Resume ↔ artifact conversion

components/super-agent/
├── chat-panel.tsx         # Chat interface
├── artifact-panel.tsx     # Artifact viewer/editor
├── message-item.tsx       # Individual message component
├── tool-indicator.tsx     # Tool execution indicator
├── quick-actions.tsx      # Suggestion buttons
├── language-selector.tsx  # Language picker
└── use-super-agent.ts    # Custom hook for state management

app/(autoTalent-app)/dashboard/agent/
├── page.tsx              # Standalone agent page
└── layout.tsx            # Agent page layout (optional)

app/api/super-agent/
└── route.ts              # Streaming API endpoint

components/resume/editor/
└── agent-side-panel.tsx  # Agent embedded in resume editor

database/
└── super-agent-schema.sql # New tables
```

---

## Implementation Order

| Step | Task | Priority | Depends On |
|------|------|----------|------------|
| 1 | Phase 1.2 — Define tools (`lib/super-agent/tools.ts`) | HIGH | — |
| 2 | Phase 1.3 — User context loader | HIGH | — |
| 3 | Phase 1.4 — System prompt | HIGH | 1, 2 |
| 4 | Phase 1.1 — API route | HIGH | 1, 2, 3 |
| 5 | Phase 2.1 — Artifact types | HIGH | — |
| 6 | Phase 2.3 — HTML artifact templates | HIGH | 5 |
| 7 | Phase 2.2 — Artifact panel component | HIGH | 5, 6 |
| 8 | Phase 2.4 — PDF export | MEDIUM | 7 |
| 9 | Phase 3.3 — Agent hook (`use-super-agent`) | HIGH | 4 |
| 10 | Phase 3.2 — Chat panel component | HIGH | 9 |
| 11 | Phase 3.1 — Standalone page | HIGH | 7, 10 |
| 12 | Phase 3.4 — Sidebar navigation | HIGH | 11 |
| 13 | Phase 4.1 — Resume editor agent panel | MEDIUM | 10, 7 |
| 14 | Phase 4.2 — Resume ↔ artifact sync | MEDIUM | 13 |
| 15 | Phase 5.1 — Translation tool | MEDIUM | 4 |
| 16 | Phase 5.2 — Multi-language UI | LOW | 15 |
| 17 | Phase 6.1 — Conversation persistence | LOW | 11 |
| 18 | Phase 6.2 — Artifact history | LOW | 7 |
| 19 | Phase 6.3 — Smart suggestions | LOW | 2 |
| 20 | DB migrations | HIGH | — |

---

## Key Design Decisions

1. **OpenAI as primary model** — use `gpt-4o` for the agent, leveraging function calling for tools
2. **HTML artifacts** — all outputs (resumes, cover letters, emails) are self-contained HTML documents with embedded CSS, making them portable and editable
3. **TipTap for editing** — reuse existing TipTap setup for rich-text editing of artifacts
4. **Iframe for preview** — sandboxed rendering of HTML artifacts ensures CSS isolation
5. **Vercel AI SDK** — reuse existing streaming infrastructure for chat
6. **Resizable panels** — consistent with existing resume editor UX
7. **User context in system prompt** — not every message, loaded once at conversation start and refreshable on demand
