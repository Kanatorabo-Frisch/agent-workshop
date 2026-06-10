import { z } from "zod";

/**
 * 📐 THE TRIAGE CONTRACT — the boundary between the model and your React UI.
 *
 * The workshop line: "In React, the model's output becomes UI state." Whatever
 * the model returns must parse into THIS shape, or the UI refuses to render it.
 * A good contract makes invalid output impossible to render, not merely unlikely.
 *
 * Right now the contract is EMPTY, so nothing downstream type-checks — that's the
 * exercise. Define it, and parse.ts + TriageResultCard.tsx light up.
 */

// 📐 ────────────────────────────────────────────────────────────────────────
// WORKSHOP TODO — define the TriageResult contract with Zod
//
// Build a z.object({...}) with EXACTLY these fields. Make each as tight as it
// can be — enums over strings, length caps over free text, numeric ranges:
//
//   category         enum: "bug" | "feature" | "support" | "unknown"
//   severity         enum: "low" | "medium" | "high" | "critical"
//   summary          string, 1–240 chars (a neutral one-line restatement)
//   affectedArea     enum: "checkout" | "billing" | "auth" | "dashboard"
//                          | "settings" | "unknown"
//   ownerTeam        enum: "payments" | "platform" | "growth" | "support"
//                          | "unknown"
//   suggestedAction  string, 1–300 chars
//   needsHumanReview boolean
//   confidence       number, 0..1 inclusive
//   evidence         array (max 3) of { source, note }, where
//                      source = "docs" | "incidents" | "ownership" | "user_report"
//                      note   = string, max 200 chars
//
// 💡 components/TriageResultCard.tsx reads result.severity, result.affectedArea,
//    result.evidence[].source, … as LITERAL UNIONS — that's exactly why the enums
//    above matter. Loose z.string() here = broken UI types there. And keep this
//    contract in sync with the English you wrote in prompt.ts.
// ─────────────────────────────────────────────────────────────────────────────
export const TriageResultSchema = z.object({
  category: z.enum(["bug", "feature", "support", "unknown"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  summary: z.string().min(1).max(240),
  affectedArea: z.enum([
    "checkout",
    "billing",
    "auth",
    "dashboard",
    "settings",
    "unknown",
  ]),
  ownerTeam: z.enum([
    "payments",
    "platform",
    "growth",
    "support",
    "unknown",
  ]),
  suggestedAction: z.string().min(1).max(300),
  needsHumanReview: z.boolean(),
  confidence: z.number().min(0).max(1),
  evidence: z
    .array(
      z.object({
        source: z.enum(["docs", "incidents", "ownership", "user_report"]),
        note: z.string().max(200),
      }),
    )
    .max(3),
});

export type TriageResult = z.infer<typeof TriageResultSchema>;
