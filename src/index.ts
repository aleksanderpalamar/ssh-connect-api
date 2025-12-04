import { initRedis } from "./services/redis";
import app from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

async function main() {
  try {
    await initRedis();
    app.listen(PORT, () => {
      console.log(`StabilityOps API listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start app", error);
    process.exit(1);
  }
}

main();
