import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import indexEndpoint from "./routes/index";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./swagger";
import serverless from "serverless-http";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (_req: Request, res: Response) => {
  res.json({
    msg: "server up",
  });
});

app.use("/api/v1", indexEndpoint);

// Hanya untuk lokal development (bisa dihilangkan di prod)
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`server dengan port ${port} berhasil running`);
  });
}

// Export untuk Vercel (serverless)
export const handler = serverless(app);
