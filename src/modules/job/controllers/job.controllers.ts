import type { Request, Response, NextFunction } from "express";
import { JobServices } from "../services/job.services.js";
import type {
  CreateJobInput,
  UpdateJobInput,
  JobIdParamInput,
  JobSlugParamInput,
  ListJobsQuery,
} from "../dto/job.dto.js";
import { catchAsync } from "../../../shared/utils/catchAsync.js";
import type { CompanyIdParamInput } from "../../company/dto/company.dto.js";

const jobService = new JobServices();

export const createJob = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: requesterId, role: requesterRole } = req.currentUser!;
    const data = req.body as CreateJobInput;

    const newJob = await jobService.createJobService(
      requesterId,
      requesterRole,
      data,
    );

    res.status(201).json({
      status: "success",
      data: { job: newJob },
    });
  },
);

export const getJobById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as JobIdParamInput;

    const job = await jobService.getJobByIdService(id);

    res.status(200).json({
      status: "success",
      data: { job },
    });
  },
);

export const getJobBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params as JobSlugParamInput;

    const job = await jobService.getJobBySlugService(slug);

    res.status(200).json({
      status: "success",
      data: { job },
    });
  },
);

export const getJobs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = res.locals.query as ListJobsQuery;

    const jobs = await jobService.listJobsService(filters);

    res.status(200).json({
      status: "success",
      results: jobs.length,
      filters,
      data: { jobs },
    });
  },
);

export const getJobsByCompany = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as CompanyIdParamInput;
    const jobs = await jobService.getJobsByCompanyService(id);

    res.status(200).json({
      status: "success",
      results: jobs.length,
      data: { jobs },
    });
  },
);

export const updateJob = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as JobIdParamInput;
    const { id: requesterId, role: requesterRole } = req.currentUser!;
    const data = req.body as UpdateJobInput;

    const updatedJob = await jobService.updateJobService(
      id,
      requesterId,
      requesterRole,
      data,
    );

    res.status(200).json({
      status: "success",
      data: { job: updatedJob },
    });
  },
);

export const deleteJob = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as JobIdParamInput;
    const { id: requesterId, role: requesterRole } = req.currentUser!;

    await jobService.deleteJobService(id, requesterId, requesterRole);

    res.status(204).send();
  },
);
