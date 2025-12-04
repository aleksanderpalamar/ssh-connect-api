import { z } from "zod";

export const StabilityScanSchema = z.object({
  targets: z.array(z.string().min(1)).min(1),
  checks: z.array(z.string().min(1)).optional(),
  depth: z.enum(["quick", "normal", "deep"]).optional(),
});

export const LogCheckSchema = z.object({
  targets: z.array(z.string().min(1)).min(1),
  patterns: z.array(z.string().min(1)).optional(),
  since: z.string().optional(), // ISO date-time
});

export const PerformanceAnalyzeSchema = z.object({
  host: z.string().optional(),
  metrics: z.array(z.string().min(1)).min(1),
});

export const IncidentPredictSchema = z.object({
  host: z.string().optional(),
});

export const PostmortemSchema = z.object({
  incidentId: z.string().min(1),
  logs: z.string().optional(),
});

export const SuggestRestartSchema = z.object({
  target: z.string().min(1),
});

export const MitigationSchema = z.object({
  action: z.string().min(1),
  target: z.string().min(1),
});

export const AutomationProposeSchema = z.object({
  goal: z.string().min(1),
});

export const AutomationRunSchema = z.object({
  automationId: z.string().min(1),
  targets: z.array(z.string().min(1)).min(1),
});
