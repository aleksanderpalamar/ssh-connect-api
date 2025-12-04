import { Client, ConnectConfig } from "ssh2";
import { SSHConnectPayload } from "../types/ssh";
import { makeId } from "../utils/id";
import { redis } from "./redis";

type StoredRecord = {
  id: string;
  host: string;
  port: number;
  username: string;
  authMethod: string;
  privateKey?: string;
  password?: string;
  passphrase?: string;
};

const memoryClients = new Map<string, Client>();

async function establishConnection(rec: StoredRecord): Promise<Client> {
  return new Promise((resolve, reject) => {
    const client = new Client();
    const cfg: ConnectConfig = {
      host: rec.host,
      port: rec.port,
      username: rec.username,
      readyTimeout: 20000,
    } as any;

    if (rec.authMethod === "password") cfg.password = rec.password;
    else cfg.privateKey = rec.privateKey;

    client.on("ready", () => resolve(client));
    client.on("error", (err) => reject(err));
    client.on("end", () => {
      memoryClients.delete(rec.id);
    });
    client.on("close", () => memoryClients.delete(rec.id));

    client.connect(cfg);
  });
}

export async function createSSHConnection(
  payload: SSHConnectPayload
): Promise<{ connectionId: string }> {
  const id = makeId();
  const record: StoredRecord = {
    id,
    host: payload.host,
    port: payload.port ?? 22,
    username: payload.username,
    authMethod: payload.authMethod,
    privateKey: payload.privateKey,
    password: payload.password,
    passphrase: payload.passphrase,
  };

  await redis.set(`ssh:${id}`, JSON.stringify(record), { EX: 60 * 60 * 24 }); // 24h

  const client = await establishConnection(record);
  memoryClients.set(id, client);

  return { connectionId: id };
}

export async function getClient(connectionId: string): Promise<Client> {
  if (memoryClients.has(connectionId)) return memoryClients.get(connectionId)!;

  const raw = await redis.get(`ssh:${connectionId}`);
  if (!raw) throw new Error("connection not found");

  const rec = JSON.parse(raw) as StoredRecord;
  const client = await establishConnection(rec);
  memoryClients.set(connectionId, client);
  return client;
}

export async function disconnect(connectionId: string): Promise<boolean> {
  const c = memoryClients.get(connectionId);
  if (c)
    try {
      c.end();
    } catch {}
  memoryClients.delete(connectionId);
  const res = await redis.del(`ssh:${connectionId}`);
  return res > 0;
}
