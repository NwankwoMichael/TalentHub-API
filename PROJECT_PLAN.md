## Problem Statement

TalentHub is an open source API engine designed to bridge the gap between complex job posting/ hunting and a seamless candidate/recruiter experience. The goal is to create a sybiotic but secure ecosystem where the ideal jobs meets the ideal candidate and the needs of both the recruiter and the candidate are met. It is built using mainly Node.Js, Typescript for typesafety accross the entire stack, PostgreSQL for relational schemas, Docker for containerization, GitHub Actions for efficient testing, CI/CD pipeline...

## Actors

Candidate: this are the users seeking a job(potential employees). After a successful registration on the TalentHub platform, a Candidate can mainly only create a profile, search for jobs, and apply for jobs.

Employer: this are the users looking to fill out available openings in their company (Recruiters). After a successful registration on the TalentHub platform, an Employer can create a profile(distinguished from the candidate via role), post jobs, and review applicants (Candidates who apply for jobs posted by this Employer) and have the power to either proceed with interviews, hiring of Candidate who best fits their requirements or rejecting Candidates who are not a fit

Admin: this is the platform owner who serves as the moderator and can suspend or ban users who violates the platform's policies.

## Core Modules:

Auth: this module is responisble for deciding what actions a user can perform on the platform. You can think of it as the RBAC enforcer

Users: this module covers the Candidates, Employers, and the Admin. Think of it as a general community for everyone

Profiles: this module highlights the category a user falls into and based on the role, authorizations are granted to carry out certain actions. Think of this module as a role specific community

Companies: this module is for Employers and the authorization to post jobs, and review, hire/reject candidates is fully granted

Jobs: this is the soul module of the platform as it connects both the Candidates and the Employer. A job can have multiple Candidate's application

Applications: This is an interesting module as it ties the Candidates to the jobs. A Candidate can have multiple applications

## System Flow:

Candidate Registration: a Candidate registers on the TalentHub platform via /register

Profile Creation: then proceeds to create a profile which will highlight Candidates location, Job preference, role, skills, Resume, etc.

Job Discovery: upon searching for jobs on the platform, the Candidate finds a Job posted by company which matches his/her skill

Appication: the Candidate then applies for this job, which grants the Company access to his details/resume. At this point, application is on a pending status.

Employer: which the Company would review and if they are satisfied with his profile, the will proceed to scheduling an interview(with the possibility of hiring if all is copacetic), or reject Candidate if not what they are looking for.

## Future Features:

Notifications: this is like an asynchronous operation that runs in the background without interupting the current task performed by the system. Think of it as a side effect of the outcome of some certain operations. For example, after a successful registration, send a notification on the screen/ or log a message to the console, if registration failed maybe because of already available email, ping a message to the screen or log a message "Email already exists" to the console.

Messaging: Asynchronous operation just like notification, just not within the application, but maybe an email to the user via for example mailtrap etc.

Resume Parsing: this feature should be able to deduct the details of an uploaded resume and fill out a job application form with the resume details that fits the input fields of the job application form.

Interview Scheduling: this feature keeps track of Candidate's Job application status and indicates on the platform when application progresses to an interview and can reach out to a candidate via email with a link that leads to a form where the user is asked to pick from a list of available dates for an interview.

Analytics: Maybe a weekly analysis of a percentage of jobs that was posted, a percentage of candidates that applied, a percentage of Candidate application status that moved to "SHEDULE INTERVIEW", and Percentage of hire.

## Domain relationships

user - related -> profile

Company - related -> Jobs

Job - related -> Applications

Application - related -> User
