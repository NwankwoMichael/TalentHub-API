import type { Request, Response, NextFunction } from "express";
import { applicationServices } from "../services/application.services.js";

import type {
  CreateApplicationInput,
  JobApplyParams,
  UpdateApplicationStatusInput,
  ApplicationQuery,
  ApplicationParams,
} from "../dto/application.dto.js";

import { catchAsync } from "../../../shared/utils/catchAsync.js";

export const createApplication = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { jobId } = req.params as JobApplyParams;
    const { id: userId } = req.currentUser!;
    const data = req.body as CreateApplicationInput;

    const application = await applicationServices.applyToJobs(
      userId,
      jobId,
      data,
    );

    res.status(201).json({
      status: "success",
      data: {
        application,
      },
    });
  },
);

export const getMyApplications = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id: userId } = req.currentUser!;
    const filters = res.locals.query as ApplicationQuery;

    const result = await applicationServices.getMyApplicationsService(
      userId,
      filters,
    );

    res.status(200).json({
      status: "success",
      filters,
      data: result,
    });
  },
);

export const getJobApplications = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { jobId } = req.params as JobApplyParams;
    const filters = res.locals.query as ApplicationQuery;
    const currentUser = req.currentUser!;

    const result = await applicationServices.getJobApplicationsService(
      jobId,
      filters,
      currentUser,
    );

    res.status(200).json({
      status: "success",
      filters,
      data: result,
    });
  },
);

export const updateApplicationStatus = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { applicationId } = req.params as ApplicationParams;
    const data = req.body as UpdateApplicationStatusInput;
    const currentUser = req.currentUser!;

    const application =
      await applicationServices.updateApplicationStatusService(
        applicationId,
        data,
        currentUser,
      );

    res.status(200).json({
      status: "success",
      data: {
        application,
      },
    });
  },
);

export const withdrawApplication = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { applicationId } = req.params as ApplicationParams;
    const { id: userId } = req.currentUser!;
    await applicationServices.withdrawApplicationService(applicationId, userId);

    res.status(200).json({
      status: "success",
      message: "Application withdrawn successfully",
    });
  },
);
