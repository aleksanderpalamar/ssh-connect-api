export interface SatabilityScanRequest {
  targets: string[];
  checks?: string[];
  depth?: "quick" | "normal" | "deep";
}
