export type AuthMethod = "password" | "private_key";

export interface SSHConnectPayload {
  host: string;
  port?: number;
  username: string;
  authMethod: AuthMethod;
  password?: string;
  privateKey?: string;
  passphrase?: string;
}

export interface SSHExecutePayload {
  connectionId: string;
  command: string;
  timeoutSeconds?: number;
  sudo?: boolean;
}
