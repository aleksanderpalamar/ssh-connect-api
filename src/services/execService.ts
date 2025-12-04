import { Client } from "ssh2";

export async function execOnClient(
  client: Client,
  command: string,
  timeoutSeconds?: number
): Promise<{ stdout: string; stderr: string; exitCode: number | null }> {
  return new Promise((resolve, reject) => {
    let timer: NodeJS.Timeout | null = null;
    let timedOut = false;
    if (timeoutSeconds) {
      timer = setTimeout(() => {
        timedOut = true;
        try {
          client.end();
        } catch {}
        reject(new Error("command timeout"));
      }, timeoutSeconds * 1000);
    }

    client.exec(command, { pty: true }, (err, stream) => {
      if (err) {
        if (timer) clearTimeout(timer);
        return reject(err);
      }

      let stdout = "";
      let stderr = "";
      let exitCode: number | null = null;

      stream
        .on("close", (code: number | undefined) => {
          if (timer) clearTimeout(timer);
          exitCode = typeof code === "number" ? code : null;
          resolve({ stdout, stderr, exitCode });
        })
        .on("data", (data: Buffer) => {
          stdout += data.toString();
        })
        .stderr.on("data", (data: Buffer) => {
          stderr += data.toString();
        });
    });
  });
}
