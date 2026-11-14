import express from "express";
import { globalErrorHandler } from "./shared/middleware/globalErrorHandler.js";
import cors from "cors";
import { talenthubSystemRouter } from "./shared/talentHubRouters/talentHubSystemRouter.js";
import { talentHubAPIRouter } from "./shared/talentHubRouters/talentHubAPIRouters.js";

export function createApp() {
  const app = express();

  app.use(cors());

  app.use(express.json());

  app.use(
    express.urlencoded({
      extended: true,
    }),
  );

  app.use("/talenthub/v1/system", talenthubSystemRouter);

  app.use("/talenthub/api/v1/", talentHubAPIRouter);

  app.use(globalErrorHandler);

  return app;
}
