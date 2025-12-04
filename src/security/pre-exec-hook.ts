import type { ExecMode } from "./modes";

export interface ExecContext {
  connectionId: string;
  command: string;
  mode: ExecMode;
  userAgent?: string;
  ip?: string;
}

export function beforeExecute(ctx: ExecContext) {
  console.log(`[PRE-HOOK] (${ctx.mode}) ${ctx.ip} -> ${ctx.command}`);
}

export function afterExecute(ctx: ExecContext, stdout: string, stderr: string) {
  console.log(
    `[POST-HOOK] result: stdout=${stdout.length}B stderr=${stderr.length}B`
  );
}
