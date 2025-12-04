import express from "express";
import { v4 as uuidv4 } from "uuid";
import {
  StabilityScanSchema,
  LogCheckSchema,
  PerformanceAnalyzeSchema,
  IncidentPredictSchema,
  PostmortemSchema,
  SuggestRestartSchema,
  MitigationSchema,
  AutomationProposeSchema,
  AutomationRunSchema,
} from "../validators/stabilityValidators";

const router = express.Router();

interface ScanJob {
  id: string;
  status: string;
  createdAt: number;
  result?: {
    jobId: string;
    status: string;
    summary: string;
  };
}

const jobs = new Map<string, ScanJob>();

router.post("/scan", (req, res) => {
  try {
    const parsed = StabilityScanSchema.parse(req.body);

    const jobId = uuidv4();
    const job: ScanJob = {
      id: jobId,
      status: "running",
      createdAt: Date.now(),
    };

    jobs.set(jobId, job);

    job.status = "done";
    job.result = {
      jobId,
      status: "done",
      summary: `Simulated scan for targets: ${parsed.targets.join(", ")}`,
    };

    return res.status(202).json({ jobId });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.get("/scan/:jobId", (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: "job not found" });

  return res.json({
    jobId: job.id,
    status: job.status,
    summary: job.result?.summary ?? null,
  });
});

router.post("/logs/check", (req, res) => {
  try {
    const parsed = LogCheckSchema.parse(req.body);

    const matches = (parsed.patterns || []).map((p, i) => ({
      host: parsed.targets[0],
      file: `/var/log/log-${i}.log`,
      snippet: `Simulated match for pattern "${p}"`,
    }));

    return res.json({ matches });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.post("/performance/analyze", (req, res) => {
  try {
    const parsed = PerformanceAnalyzeSchema.parse(req.body);
    const degradationScore = Math.round(Math.random() * 10000) / 100;
    return res.json({ degradationScore });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * POST /stability/incident/predict
 */
router.post("/incident/predict", (req, res) => {
  try {
    IncidentPredictSchema.parse(req.body);

    const probability = Math.round(Math.random() * 10000) / 100;
    return res.json({
      incidentRisk: probability > 70 ? "high" : "low",
      probability,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * POST /stability/incident/postmortem
 */
router.post("/incident/postmortem", (req, res) => {
  try {
    const parsed = PostmortemSchema.parse(req.body);

    return res.json({
      summary: `Postmortem for ${parsed.incidentId}. Logs length: ${
        parsed.logs?.length ?? 0
      }`,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * POST /stability/suggest/restart
 */
router.post("/suggest/restart", (req, res) => {
  try {
    const parsed = SuggestRestartSchema.parse(req.body);

    const window = new Date(Date.now() + 3600 * 1000).toISOString();

    return res.json({ suggestedWindow: window });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * POST /stability/mitigate
 */
router.post("/mitigate", (req, res) => {
  try {
    const parsed = MitigationSchema.parse(req.body);

    return res.json({
      details: `Mitigation '${parsed.action}' applied to ${parsed.target} (simulated)`,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * POST /stability/automation/propose
 */
router.post("/automation/propose", (req, res) => {
  try {
    const parsed = AutomationProposeSchema.parse(req.body);
    const id = uuidv4();

    return res.status(201).json({
      automationId: id,
      script: `#!/bin/bash\necho "Generated automation for: ${parsed.goal}"`,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * POST /stability/automation/run
 */
router.post("/automation/run", (req, res) => {
  try {
    const parsed = AutomationRunSchema.parse(req.body);

    return res.json({
      status: "ok",
      automationId: parsed.automationId,
      targets: parsed.targets,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;
