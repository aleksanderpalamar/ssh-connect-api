import fs from "fs";
import path from "path";

const LOGFILE = path.join(process.cwd(), "audit.log");

export function audit(entry: object) {
  const line =
    JSON.stringify({ ts: new Date().toISOString(), ...entry }) + "\n";
  fs.appendFileSync(LOGFILE, line);
}
