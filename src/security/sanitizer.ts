export function sanitizeArg(arg: string) {
  return arg.replace(/[\x00-\x1F\x7F]/g, "").trim();
}
