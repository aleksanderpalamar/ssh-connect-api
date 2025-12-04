import { Router } from "express";
import { getClient } from "../services/sshService";
import { isCommandSafe } from "../security/validator";
import { isAllowedByMode } from "../security/modes";
import { beforeExecute, afterExecute } from "../security/pre-exec-hook";
import { audit } from "../services/audit";

const router = Router();

router.post("execute", async (req, res) => {
  try {
    const { connectionId, command, mode = "safe" } = req.body;

    const client = await getClient(connectionId);
    if (!client) {
      return res.status(404).json({ error: "connection not found" });
    }

    if (!isCommandSafe(command)) {
      return res.status(403).json({ error: "blocked_by_blacklist" });
    }

    if (!isAllowedByMode(command, mode)) {
      return res.status(403).json({ error: "blocked_by_mode" });
    }

    const ctx = {
      connectionId,
      command,
      mode,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    };

    beforeExecute(ctx);
    audit({ event: "exec_start", ...ctx });

    const result = await new Promise<{
      stdout: string;
      stderr: string;
      code: number;
    }>((resolve, reject) => {
      client.exec(command, (err, stream) => {
        if (err) return reject(err);

        let stdout = "";
        let stderr = "";

        stream
          .on("data", (d: Buffer) => (stdout += d.toString()))
          .stderr.on("data", (d: Buffer) => (stderr += d.toString()))
          .on("close", (code: number) => {
            resolve({ stdout, stderr, code });
          });
      });
    });

    afterExecute(ctx, result.stdout, result.stderr);
    audit({ event: "exec_end", ...ctx, result });

    return res.json({
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.code,
    });
  } catch (error) {
    console.error("EXEC ERROR:", error);
    audit({ event: "exec_error", error: String(error) });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
