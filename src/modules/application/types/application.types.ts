import type { Application, Prisma } from "@prisma/client";

export type ApplicationData = Application;

export type ApplicationWithJob = Prisma.ApplicationGetPayload<{
  include: {
    job: {
      select: {
        id: true;
        title: true;
        slug: true;
        location: true;
        workType: true;
        status: true;
        company: {
          select: {
            id: true;
            name: true;
            slug: true;
            logoUrl: true;
          };
        };
      };
    };
  };
}>;

export type ApplicationWithApplicant = Prisma.ApplicationGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        email: true;
        profile: {
          select: {
            bio: true;
            location: true;
            years_of_experience: true;
            resume_Url: true;
            skills: true;
          };
        };
      };
    };
  };
}>;
