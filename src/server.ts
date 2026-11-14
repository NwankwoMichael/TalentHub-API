import { createApp } from "./app.js";
import { prisma } from "./shared/config/prisma.js";
import { logger } from "./shared/lib/logger.js";
import { env } from "./shared/config/env.js";

const port = env.port;
const runServer = createApp();

const gracefulShutdown = async () => {
  logger.info(`\nStopping server and closing connections...`);
  await prisma.$disconnect();
  process.exit(0);
};

runServer.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
