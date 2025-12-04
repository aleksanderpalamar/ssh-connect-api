import { z } from "zod";

export const SSHConnectSchema = z.object({
  host: z.string().min(1),
  port: z.number().int().positive().optional().default(22),
  username: z.string().min(1),
  authMethod: z.enum(["password", "private_key"]),
  password: z.string().optional(),
  privateKey: z.string().optional(),
  passphrase: z.string().optional(),
});

export const SSHExecuteSchema = z.object({
  connectionId: z.string().min(1),
  command: z.string().min(1),
  timeoutSeconds: z.number().int().positive().optional(),
  sudo: z.boolean().optional(),
});
