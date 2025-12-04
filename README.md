# SSH Connect API

> **API Gateway for GPT Custom Actions Integration**

Node.js + TypeScript API that provides protected SSH access for AI agents. Designed to be consumed as an **Action** in ChatGPT custom GPTs, allowing your assistant to securely execute commands on remote servers.

![ChatGPT Actions Integration](https://img.shields.io/badge/ChatGPT-Actions-00A67E?style=for-the-badge&logo=openai&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

## 🎯 What is it?

This API works as a **Gateway** between your custom GPT and SSH servers. When you configure an Action in ChatGPT pointing to this API, your GPT gains the ability to:

- Connect to servers via SSH
- Execute commands securely with full audit trail
- Analyze logs, performance, and system stability

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Custom GPT    │────▶│  SSH Connect API │────▶│   SSH Server    │
│   (ChatGPT)     │◀────│    (Gateway)     │◀────│    (Target)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
      Actions              x-api-key Auth            ssh2 Client
```

## ✨ Features

- **🔐 API Key Authentication** - `x-api-key` header required on all requests
- **🛡️ Multi-layer Security** - Dangerous command blacklist + execution modes (safe/power/root)
- **📦 Redis-backed Sessions** - SSH credentials stored with 24h TTL
- **🔄 Auto Reconnection** - SSH clients transparently reconnect if connection drops
- **📝 Audit Trail** - All executions logged to `audit.log`
- **🚫 Destructive Command Protection** - Blocks `rm -rf`, fork bombs, disk formatting, etc.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Redis (local or via Docker)
- Docker & Docker Compose (optional)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd ssh-connect-api

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API_KEY and REDIS_URL
```

### Running

**With Docker (recommended):**

```bash
docker-compose up
```

**Local development:**

```bash
# Start Redis first
docker run -d -p 6379:6379 redis:alpine

# Start the API
npm run dev
```

## 🔧 Setting up in ChatGPT

1. Go to [ChatGPT](https://chatgpt.com) and navigate to **My GPTs** → **Create GPT**
2. In the **Configure** tab, scroll to **Actions** → **Create new action**
3. In **Authentication**, select **API Key** and configure:
   - Auth Type: `API Key`
   - Auth Type: `Custom`
   - Custom Header Name: `x-api-key`
4. In **Schema**, import the API's OpenAPI spec or paste the schema JSON
5. Set the server URL pointing to your API instance

> ⚠️ **Important**: The API must be publicly accessible (or via tunnel like ngrok/cloudflare) for ChatGPT to make requests.

## 📡 API Endpoints

### SSH

| Method | Endpoint          | Description                                    |
| ------ | ----------------- | ---------------------------------------------- |
| `POST` | `/ssh/connect`    | Creates SSH connection, returns `connectionId` |
| `POST` | `/ssh/execute`    | Executes command on an active connection       |
| `POST` | `/ssh/disconnect` | Terminates an SSH connection                   |

### Stability (Stubs)

| Method | Endpoint                         | Description           |
| ------ | -------------------------------- | --------------------- |
| `POST` | `/stability/scan`                | Starts stability scan |
| `GET`  | `/stability/scan/:jobId`         | Gets scan status      |
| `POST` | `/stability/logs/check`          | Log analysis          |
| `POST` | `/stability/performance/analyze` | Performance analysis  |

## 🛡️ Security System

### Execution Modes

| Mode    | Description                    | Blocks                                                      |
| ------- | ------------------------------ | ----------------------------------------------------------- |
| `safe`  | Default mode, most restrictive | `restart`, `kill`, `docker stop/start`, `systemctl restart` |
| `power` | Allows maintenance operations  | `dd`, `mkfs`, `rm -rf`                                      |
| `root`  | No mode restrictions           | None (only global blacklist)                                |

### Global Blacklist

Commands always blocked regardless of mode:

- `rm -rf /` and variations
- Fork bombs (`:(){:|:};:`)
- `dd` on devices (`/dev/sda`, etc.)
- Disk formatting (`mkfs.*`)
- Critical file overwrites (`> /etc/passwd`)
- Download and direct execution (`curl | sh`, `wget | sh`)

## 📁 Project Structure

```
src/
├── app.ts                 # Express app + auth middleware
├── index.ts               # Entry point
├── routes/
│   ├── ssh.ts             # SSH endpoints
│   └── stability.ts       # Stability endpoints (stubs)
├── security/
│   ├── modes.ts           # Mode filters (safe/power/root)
│   ├── validator.ts       # Command validation
│   ├── sanitizer.ts       # Input sanitization
│   └── commands/
│       └── blacklist.ts   # Blocked command patterns
├── services/
│   ├── sshService.ts      # SSH connection management
│   ├── redis.ts           # Redis client
│   └── audit.ts           # Audit logging
├── types/                 # TypeScript interfaces
└── validators/            # Zod schemas
```

## 🔒 Production Security

- **Never expose the API directly to the internet** - Use VPN, firewall, or secure tunnel
- **Rotate API_KEY periodically**
- **Use secrets manager** for SSH private keys
- **Monitor audit.log** to detect suspicious activity
- **Configure rate limiting** on your reverse proxy

## 📝 Environment Variables

| Variable    | Description            | Default                  |
| ----------- | ---------------------- | ------------------------ |
| `API_KEY`   | API authentication key | (required)               |
| `REDIS_URL` | Redis connection URL   | `redis://localhost:6379` |
| `PORT`      | API port               | `3000`                   |

## 📄 License

MIT
