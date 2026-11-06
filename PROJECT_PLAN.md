## Problem Statement

TalentHub is an open source API engine designed to bridge the gap between complex job posting/ hunting and a seamless candidate/recruiter experience. The goal is to create a sybiotic but secure ecosystem where the ideal jobs meets the ideal candidate and the needs of both the recruiter and the candidate are met. It is built using mainly Node.Js, Typescript for typesafety accross the entire stack, PostgreSQL for relational schemas, Docker for containerization, GitHub Actions for efficient testing, CI/CD pipeline...

## Actors

Candidate: this are the users seeking a job(potential employees). After a successful registration on the TalentHub platform, a Candidate can mainly only create a profile, search for jobs, and apply for jobs.

Employer: this are the users looking to fill out available openings in their company (Recruiters). After a successful registration on the TalentHub platform, an Employer can create a profile(distinguished from the candidate via role), post jobs, and review applicants (Candidates who apply for jobs posted by this Employer) and have the power to either proceed with interviews, hiring of Candidate who best fits their requirements or rejecting Candidates who are not a fit

Admin: this is the platform owner who serves as the moderator and can suspend or ban users who violates the platform's policies.

## Core Modules:

Auth: this module is responsible for user authentication and authotization. It liases with the RBAC middleware to decide what actions a user can perform on the platform. It owns: Registration, Login, Password Hashing, JWT, Refresh Tokens, and Password Reset.

Users: this module covers the Candidates, Employers, and the Admin. Think of it as a general community for everyone where users are later separated by their role.

Profiles: this module contains professional information about the candidate such as bio, skills, resume, location, and experience. This of it as an ID card for candidate

Companies: this module holds the information of the company such as company's name, website, description, and logo. Think of it as the ID card for company

Jobs: this is the soul module of the platform as it connects both the Candidates and the Employer. A job handles the posting of jobs and can have multiple Candidate's application

Applications: This is an interesting module as it ties the Candidates to the jobs. A Candidate can have multiple applications

## System Flow:

Candidate Registration: a Candidate registers on the TalentHub platform via /register

Profile Creation: then proceeds to create a profile which will highlight Candidates location, Job preference, role, skills, Resume, etc.

Job Discovery: upon searching for jobs on the platform, the Candidate finds a Job posted by company which matches his/her skill

Appication: the Candidate then applies for this job, which grants the Company access to his details/resume. At this point, application is on a pending status.

Employer: which the Company would review and if they are satisfied with his profile, the will proceed to scheduling an interview(with the possibility of hiring if all is copacetic), or reject Candidate if not what they are looking for.

## Future Features:

Notifications: this can be either asynchronous operation that runs in the background without interupting the current task performed by the system, or synchronous operations like side effect of certain executions. For example, application submitted would immediately create Notification record inside the same request (synchronous), while sending emails later via RabbitMQ, BullMQ, Queue would be asynchronous.

Messaging: Asynchronous operation just like notification, just not within the application, but maybe an email to the user via for example mailtrap etc.

Resume Parsing: this feature should be able to deduct the details of an uploaded resume and fill out a job application form with the resume details that fits the input fields of the job application form.

Interview Scheduling: this feature keeps track of Candidate's Job application status and indicates on the platform when application progresses to an interview and can reach out to a candidate via email with a link that leads to a form where the user is asked to pick from a list of available dates for an interview.

Analytics: Maybe a weekly analysis of a percentage of jobs that was posted, a percentage of candidates that applied, a percentage of Candidate application status that moved to "SHEDULE INTERVIEW", and Percentage of hire.

## Domain relationships

User - related -> Profile

User - related -> Applications

Company - related -> Jobs

Job - related -> Applications

Employer(User) - related -> Company

Bigger picture

User -> Profile
|
-> Applications
|
-> Bookmarks

Company
|
-> Jobs

Job
|
-> Applications

Architect Question #1

## Why should Applications be a separate module instead of simply storing applicants inside jobs?

Answer: Jobs should focus on job postings, while Applications should focus on the interaction between candidates and jobs.

In other words:
Aside from the fact that having a separate Application skeeps things clean, it becomes easy to separate concerns as Job module handles posting of job and direct link to the Company and Applications can handle direct link to Users and both Company and User can interact through the link between Job and Application. This avoids a clustered Job module which would have been linked to both Company and User(Candidates)
