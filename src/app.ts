import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import sshRoutes from "./routes/ssh";
import stabilityRoutes from "./routes/stability";

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use((req, res, next) => {
  const key = req.headers["x-api-key"];
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
});

app.use("/ssh", sshRoutes);
app.use("/stability", stabilityRoutes);

app.get("/", (_req, res) => res.json({ ok: true }));

export default app;
