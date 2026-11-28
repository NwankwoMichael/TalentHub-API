## What is prisma:

Prisma is an ORM that provides a type-safe abstraction layer between your application and your database.

## What problem does it solve:

-Because it supports type safety, it catches data-related error

-It automatically generates code based on your model schema, making database interaction swift and less error prone

- Reduces boilerplate
- Improves developer experience
- Generates type-safe database queries
- Provides migration management
- Makes refactoring safer

## what is prisma client:

Prisma Client is the generated TypeScript library used by your application to interact with the database in a type-safe manner.

## What is a Migration:

Migration in prisma is a declarative data modeling. So let's say you have structured your model schema, migration builds the actual tables in your database based on the defined model schema.

Model Schema
↓
Migration
↓
Database Structure

A migration is essentially a versioned history of database changes.

<!-- Assignment 5.2 -->

Aside from the fact that we are trying to separate concern and make each module more feature focused, authentication is a very essential feature on it own that ensures the platform remains secure. I think something as fragile and paramount shouldn't be in the User module. That way User module focuses on User related business, while auth focuses on authentication and authorization.

What is hashing?:
Hashing is a one way security process that takes any data passed to it for example a password, and converts it into a fixed length string of numbers and letters

Why don't we store passwords directly?:
We will be risking user's account compromise if for instance a hacker successfully bridges our system and gains access to our database.

Difference between:

Encryption: this is a two way street meant for transmission or data confidetiality, meaning it can be reversed via decryption

Hashing: this is a one way street meant for full proof data integrity as it can not be reversed, and because the hash of any particular data would always turn out the same everytime, inputing password during login only hashes the password and compares the hashed password to the original hashed password stored in the database.

Why use bcrypt: we use bcrypt because it is intentionally slow due to the salt round, compare to sha256 which take 1 millieseconds to calculate.
What these does is to make it impossible for hacckers who try to use brute force as a 10 salt bcrypt would move about 100 milliseconds slower making it mathematically impossible for a brute force attack to succed or in worst case too expensive to execute.

<!-- Assignment 5.3 -->

Auth DTO Design

interface RegisterUserDto{
email: string; // email should contain @ and .
password: string;// password should be atleast 8 characters
role: UserRole; // we have to ensure user cannot pick ADMIN
}

These are the required fields for user registration as id is set to a default uuid, status is set to a default active and user shouldn't be able to change their status

interface LoginUserDTO{
email: string;
password: string
}

As for login, only the email and password should be required as at this point, the role is saved to the database and isn't needed for authentication during login.

We should also ensure that user can not input ADMIN as role even though it is part of the UserRole enum.

Are we using Zod for this??

<!-- Validation Design -->

function validateRegisterData(body: any){
if(!body.email || typeof body.email !== "string"){
console.error("Email is required and must be a valid text string)
}else if(!body.email.includes("@") || !body.email.includes(".")){
console.error("Please porvide email with valid format.")
}

if(!body.password || typeof body.password !== "string){
console.erro("Password is required and must be a text string)
}else if(body.password.length < 8){
console.error("Password must be at least 8 characters")

//we can also write a logic that loops through the inputed password which is basicaly an iterable string and we can push any toUppercase, and the asci value that represents a string number(regex) into a temp variable with a counter via check. if the counter.length is < 1 we console.log("Password must contain a capital letter for the toUppercase check, & log the "contain a numerical value" for the asci number value(regex) counter.)
}

}

Users should never be allowed to register as ADMIN. Only as either CANDIDATE OR EMPLOYER.

WHY?:
The ADMIN role is reserved for only the platform owner, plus due to the authorization that comes with the role of an admin, Users will be be able to bypass suspension and deactivation, or even delete/deactivate/suspend competition's account if allowed to register as ADMIN.

<!-- Assignment 5.5 -->

for FindUserByEmail which finds a user in the database by that user's email, you need just the userEmail. this is a getOne kind of request

for CreateUser which registers a new user, you need the userEmail, UserPassword, and userRole(which must not be "ADMIN"). we also need a way of checking that this user email does not exist in our database by either calling the findUserByEmail, if it returns a user, we know not to proceed, and we proceed if no user is found with the email input(we can also use redis caching for db optimization)

for UpdateUserStatus which is used by an ADMIN to update a user's status, you need userEmail or userId.

<!-- Assignment 5.6 -->

Register User: this service is called when the /register endpoint is fired. It basically registers a user on the platform by calling the createUser Repository function. In this process, the password is hashed and saved to the db, the confirmPassword is discarded and a JWT token is created and returned to in the response

Login User: will require authentication with the JWT token that was sent after successful login(token must have not expired, depending on it expireIn). This is fired when a user fires the /login route

verify password: comes in during login as the inputed password is hashed and this newly hashedPassword is compared with the hashed password saved in the database during registration. If verify password fails, user won't be logged in (Access denied), but if verify password passes, and jwt.verify passes, user is logged in.

Generate Token happens during login and is sent back in the res.json as it is only created when passwordConfirm function passes and user is logged in.

What belongs in controller:
instead of having a messy router with the async req,res,next funtion, where the req.body is received and extracted and services, repository are called, we just abstract all these in the controller, then import it to the routes, thereby keeping concerns separated and a general clean routes file.

Sevices contains pure business logic like hashing password, then then calling create user which will interact with the repository...

<!-- Assignment 5.7 -->

What is JWT?
JSON web token is a stateless self contained token authentication system that can be generated when signup user passwords matches the hash password saved in the database during login. It is made up of three parts which are: the header which contains metadata about the token it self.

The payload which basically can contain any meta data of the user (note that this is encoded and not encrypted, meaning it can be easily read if anyone accesses it, so sensitive data like passwords, secrets, etc shouldn't be stored in it).

The third part of a JWT is the signature which is a conjoining of the header, payload and secret from the server.

It is important to note that JWT should be sent in a HTTPS secure route...

Why use JWT:
JWT is stateless secured authorization which very much suits restful APIs, meaning the server doesn't bother about saving any state.

What information should be inside a token:
The token is basically a string. it is made up of the header(meta data about the token itself), the payload(meta data about the user, which should be insesitive data like user name, userId role, etc. No password, third parties API secret keys etc), and finally the signature which is a combination of the header, payload, and the secret from the server.

What information should never be inside a token:
Never include sensitive data like user password, access tokens, public/secret keys, etc because the JWT is encoded, not encryted meaning anyone who intercepts it can easily decode and read them

<!-- Assignment 5.8 -->

Access token in my understanding is the JWT initial token that was created after a successful login

While refresh token is the token that we get after the expiresIn duration of the access token run out

It is important for token to mot last forever because supposing another person uses a laptop in which a user of our platform logged in to his account, the fact that token for example is everlasting would mean this unauthorized person can just continue where the user left of without needing to log back in as they will continue to enjoy authentication priveledges..

the access token if I am not mistaking should be stored in httpOnly cookie, memory, storage mechanisms

<!-- Assignment 5.9 -->

Register--> input req bodies -- > validate bodies --> extract req.body.password --> hash password --> store user in DB --> login --> find user via email --> if user is not found --> return a 404 not found error(and abort login) --> if user is found --> system hashes the new inputed password and compares it with user Hash password in the DB --> if it doesn't match --> return fail and abort login --> if password compare matches --> Generate JWT --> Return Token to client

<!-- Assignment -->

ADMIN : acts as a moderator

Can ban/suspend Users, view Reports, Manage Platform

Candidate: Job seeker

Can Apply for jobs, view jobs, bookmark jobs, can create profile, upload resume, can only read a summary of Analytics of like weekly or monthly hirings on the platform, can rate in interviews only if interviewed(i.e review must be greater than the interview date)

Cannot post/cannot create companies, create jobs, cannot review Applications, suspend/ban Users

Employer:

Can create/post jobs, review Application, can create companies, can change application status

cannot manage users, can not ban accounts, suspend account

<!-- Authentication operations -->

FindUserByEmail

CreateUser

StoreRefreshToken

FindUserById (for token verification)

FindUserByEmailForLogin

<!-- User module operations -->

GetUserProfile

UpdateUserProfile

GetUserById

DeleteOwnAccount

<!-- Admin Module operations -->

SuspendUser

DeactivateUser

BanUser

GetAllUsers

GetPlatformReports

<!-- Registration flow -->

Register
↓
Create Account
↓
Login Separately

<!-- Phase 6: Authentication implementation -->

<!-- Assignment 6.1 -->

Password Hashing: npm i bcrypt --save-dev @types/bcrypt

JWT Creation and JWT Verification: npm i jsonwebtoken --save-dev @types/jsonwebtoken

<!--  -->

Bcrypt solves the problem of securing user's password through hashing which is a one way street
full proof password conversion into a 64 string code...

Jsonwebtoken solves the problem of enabling a stateless means of user authentication

<!-- Architect Question -->

Validation should allow ADMIN as an input as this allows validation to focus only on applying constrainsts and so we can handle the application of business rules in the services.

<!-- Why inferred DTOs are better than duplicated types -->

This are better because the inferred dto carries the type of the validation schema, meaning it will alway be in sync with the accepted data of the model making it a legitimate source of truth

<!-- Why should the repository not hash passwords? -->

The repository should be concerned with hashing password because ideally, the repository is only suppose to manage or handle database related logics not business related implementations like hashing of passwords. Hashing of password should be handled by services.

<!-- Should services return Prisma Models or Response DTOs? -->

I think services should return Respose DTOs as it wlli simply just ensure that the data flowing in the application are consitent with our DTO and also, prisma models should just remain in the repository which should be the database specialist.

<!-- What fields should placed inside the payload? -->

Only non-sensitve fields. In my case, I only placed userId, role, and email

<!-- Should every endpoint return a consistent shape? -->

Yeah every endpoint should return a consistent shape that way things stay consistent and easier to manage

 <!-- Why is throw new Errror(...) everywhere a bad long-term strategy? -->

it makes it quite complex to make corrections and makes our codebase very bug prone as opposed to having a centralized error handler like AppError(). This centralized approach would helo us keep the code base organized and also enable that we adhere to the DRY code principles.

Note: I am sure there are some recommended refinement and I am very open to your review, I just wanted to share what I have been able to come up with so far...

I was also thinking we need to implement like a logger, AppError wrapped in a catchAsync utility so we don't have to keep using try/catch block in all our async function... I also want to write a CI file and push what we have come up with to the repo...

Phase 7: Company Module

The Company's module exists because:

Candidates apply for jobs

Jobs belong to Companies

Companies belong to Employers

Without Companies, jobs don't really make sense

<!-- Assignment 7.1 -->

Should an Employer own many companies or one Company?

## An emo=ployer can own multiple companies

Can multiple employers manage one company?

## Ideally, I would say multiple employers can be affilated as in real world, I can own my company and still have shares in another company, making it sensible to build TalentHub to mimic the real world scenario where multiple employers can manage one company.

Who is the company owner?

## The Employer is the company owner

Which of the Company's field should be optional:
Based on the company's prisma model, the optional field should be logoUrl which is just a url leading to the logo of the company,

Why:
I think it is ok that the logoUrl is optional because even though it is aesthetically appealing and adds more information about the company, it is just not a compulsory feature.

Note:
I also added tbe slug, industry, headquater and size to Company's prisma schema model

<!-- Assignment 7.3 -->

Can this happen?
Candidate -> create Company:

No! A candidate will be restricted via the restrictTo middleware(which accepts userRole and apply restriction/access grant) from creating a company. Candidates are permitted to create Applications, not create Company.

Where Should this rule live?

The rule of whether a candidate not being permited should be handled by the restrictTo middleware which is located in /shared/middlewares

<!-- Assignment 7.4 -->

Company DTO Design

For UpdateCompanyDto, I don't think all the fields should be required, which is why opted for .partial()

For the validation, I opted for the enum approach so as to ensure consistency. Meaning nothing can be changed or can there be an error input as a user entry can only accepted if it is either values of the validation.

<!-- Assignment 7.6 -->

## Define responsibilities:

1. createCompany: this db handler would be tasked with the responsibility of creating a company table in the database

2. findCompanyById: this will run a SELECT query Where it argument(id) matches the company id (row) in the Company table

3. findCompanyBySlug: this will search and return a company via it unique slug

4. updateCompany: this handler will be used to update the fields of a company in the database

5. deleteCompany: this will be responsible for deleting a company from the database

6. findCompanies: this database handler will be used to find all/multiple companies(depending on if we want to include or search by filters)

## Should repositories enforce ownership? Or only retrieve data?

Repository main responsibility is to manage database related logic, meaning the enforcement of ownership should be handled in service. So the answer should be no.

<!-- Assignment 7.7 -->

## Who generates company slug?:

Company slug would be generated by me in my backend services. I actually created a slug folder in utils with generateSlug.ts, and slugParamSchema so I can easily import it whenever I need to generate slug for any module so I can maintain DRY code and also ensure zod validation for slug in my project.

<!-- Assignment 7.8 -->

Who can call each route?

post /companies: this can be called by the Employer.

Get /companies:id: this in my opinion should be accessed by all authenticated users so I placed the companyRouter.use(protectRoute) at the top so only authenticated users can access the company endpoints

patch: this can be accessed by only users with role of EMPLOYER who passes the verifyCompanyOwnership check and ADMIN.

Delete: Just like patch, this can be accessed by users whose role is either EMPLOYER (and have passed the verifyCompanyOwnership check) or ADMIN

<!-- Assignment 7.9 -->

I abstracted the business logic responsibility of verifying company ownership to a separate function in the CompanyServices class, which enabled me to call this service accross multiple services in the CompanyServices class without violating the DRY principles.

This was an opportunity for the protectRoute and restricTo middlewares to shine as the protectRoute ensured that a user is authenticated, while the restrictTo middleware performed a Role Based Access Control before we even get to the controller, thereby gauranteeing that rival company or unauthorized users cannot delete a company...

So a company creation flow would be for :

companyRouter.post("/",) -> ("/", validateBody(CreateCompanyshema),): here our validateBody middleware validates the input -> ("/", validateBody(CreateCompanySchema), protectRoute,): the protectRoute ensures that the user is authenticated via jwt.verify... -> restrictTo("EMPLOYER"): this middleware ensures that only users with EMPLOYER roles can create a company(RBAC enforcement) -> check existing company: this is implemented inside the createCompany service class instance, I decided that there can be companies with the same name but, I created a generate slug helper that guarantees that slugs are always unique. So let's say there is RP ltd New York and RP ltd London, their slug will be totally different regardless of the similar company names. -> create slug: now because I restricted the creation of slug to my backend service, instead of having Employers choose their own slug, I generated the slug in the createCompany service instance and injected it into the createCompanyDB data.slug arguments.. -> Store company: if all is copacetic, calling the createCompanyDB repository handler with the slug I already created passed in as argument, creates a new company and stores it to the Database -> then my controller returns am https response based on the success or failure of the whole process.

<!-- Assignment 7.11 -->

Expected failures includes:
Forbidden error: which will occur when an unAuthorized user tries to create a company, or another employer trying to edit or delete another employer's company

validation error: when the validateBody middleware fails

NotFound Error: when the verifyCompanyOwnership inctance fails to find a matching company in the database to the provided companyId

Challenges I encountered:
I early assigned JWTUSerPayload (which references userId instead of id) to currentUser in types/express.d.ts (currentUser?: JWTUserPayload) this caused a misalignment between prisma and my DTOs because userId is only suppose to exist in the TokenPayload. This caused my Postman createCompany request to fail. Initially, I tried manually mapping between Prisma and my DTO, but this was kind of repetitive and has a higher risk of me forgetting to map and just returning user which referenced id instead of userId, thereby always making TypeScript to yell at potential runtime bug.... What I did was to reassign currentUser in the express.d.ts to UserResponse so it matches what my protectRoute assigns at runtime (which is id not userId, in sync with prisma), then I kept the JWT claims only JWTUSerPayload.
So, JWT Token (decoded) is typed as JWTUserResponse thereby resulting to decoded.userId inside protectRoute. Whereas verified User (req.currentUser) is typed as UserResponse which references id (req.currentUser!.id) in all and future modules.
Result, is the Postman create company request now passes with a 201 status code and my CI passes on git Push.

Note: Earlier I wanted TalentHub company endpoints to be accessible only to registered and authenticated users.

After reviewing how recruitment platforms typically operate, I decided to allow public access to:

GET /company GET /company/:id GET /company/slug/:slug

This allows search engines, recruiters, candidates, and unauthenticated visitors to discover companies on the platform.

Mutation endpoints remain protected and require authentication and authorization.

POST /company PATCH /company/:id DELETE /company/:id

Protected owner routes also remain authenticated:

GET /company/owner/me GET /company/owner/:ownerId

Future Vision:
Multiple Employers can manage one company.

Current Implementation:
One Owner per Company

---

Phase 8: Job Module

The Job module allows employers to create, manage, and publish jobs under their companies.

<!-- Assignment 8.1 -->

## Can a Job exist without a company?:

No, a job is directly related to the company module

## Can a company have multiple jobs?:

Yes. A company can have multiple jobs

## Can candidates create Jobs?:

No, only an employer can create jobs under his company. Candidates can create applications for jobs.

<!-- Assignment 8.2 -->

Required fields:
title: this is a required field as it enhances job identity and I don't see how a candidate will locate or apply for a job without a title. The title indicates if the job is a fit for any candidate, and also enables the backend generateSlug utility genenrate unique slugs.

description: This further narate what the job is all about like it core business idea, what the day to day of the job will be like, and most especially, what requirements are expected of a candidate.

companyId: This ties the job to it company, and ideally should be provided by the employer to establish that he/ she owns a company.

workType: This indicates if the job is a fulltime, contract, or parttime. Which further helps candidates know what the job is all about

experienceLevel: this is very important as it tells the years of expertise a candidate must have in order to be a fit for the job.

location: This is where the employer indicate where hired candidates would work from and it has an enum of JobLocation which can either be REMOTE, HYBRID, or ON_SITE.

companyId: this tells prisma which of the employer's companies owns the job

Optional field:
salaryMin & salaryMax: the employer can either choose to indicate the minimum or maximum salary that a candidate should expect. This in my opinion, shows transparency and makes the hiring process less cumbersome if indicated as the candidate already accepts the indicated salary range

{
title;
description;
location;
workType;
experienceLevel;
salaryMin?;
salaryMax?;
companyId;
}

## Key Design Choices for Job Module

Why companyId is in CreateJobSchema (and omitted in UpdateJobSchema): Because one employer can own multiple companies, they must specify which company is posting the job on creation—and in JobServices, you'll call companyServices.verifyCompanyOwnership(data.companyId, requesterId, requesterRole) so an employer cannot post a job under a competitor's company. Omitting companyId from UpdateJobSchema prevents transferring an existing job listing to another company.

Why status is only in UpdateJobSchema: Newly created jobs default to ACTIVE in Prisma, while employers use PATCH /jobs/:id to change status to CLOSED or EXPIRED once the role is filled.

Rich Job Search Filters: ListJobsQuerySchema already supports filtering by keyword (search), location, workType, experienceLevel, and companyId alongside pagination.

<!-- Assignment 8.6 -->

Repository Design

possible methods:

createJob():

findjobById():

findJobBySlug():

findJobs():

findJobsByCompany():

updateJob():

deleteJob():

countApplications()

## Should repositories enforce ownership?:

No. Repositories should focus solely on database relations, while the enforcemant of ownership is left to the services (verifyJobOwnership instance in jobServices)

<!-- Assignment 8.8 -->

## Should jobs be public?

I will allow jobs to be public because candidates need to search jobs, but creating of jobs would be retricted to only EMPLOYER

EXAMPLES:
GET /jobs
Get /jobs/:id
Get .job/:slug

-------- Would all be public

<!-- Assignment 8.9 -->

Protected Routes

EXAMPLES:
POST /jobs
PATCH /jobs/:id
DELETE /jobs/:id

------------- Would all be protected and RBAC would be enforced in favor of only EMPLOYER

<!-- Assignment 8.11 -->

---------------Job Status :
This introduces:
enum JobStatus{
ACTIVE
CLOSED
EXPIRED
}

Questions:
Can candidates apply to:

Jobs with JobStatus === "ACTIVE": Yes, because the active status signifies that employer is still looking for the candidate who best fits.

Jobs with JobStatus === "CLOSED": No, because it simply indicates that the job has been taken, i.e., a candidate has been hired.

Jobs with JobStatus === "EXPIRED": No, because usually recruitment platforms stipulates an expiry date to every job and after that expiry date, applying would just be obselete

<!-- Assignment 8.13 -->

Error Scenarios:
Company Not Found: this refers to the scenario when a user tries to hit the GET "talenthub/api/v1/job/" routes and the companyService.getCompanyById in the getJobs handler returns null.. (404 NotFound Erorr)

Non-owner Creating Job: This error refers to the scenario when the companyService.verifyCompanyOwnership returns null, meaning the requesterID does not match the ownerId in the company.

Invalid Salary Range: This is when the salaryMax < salaryMin conditional returns true, especially in the jobService.updateJob service handler. A salaryMax should ideally be more than the salaryMin.. (400 validation Error)

Candidate Creating Job: This will return a 403 forbidden error as soon as the restrictTo("EMPLOYER") middleware is hit right before the request hits the createJob controller.

Job Not Found: This error is a 404 NotFound error which occurs when a user hits the GET /talenthub/api/v1/job/:id endpoint as the getJobById controller calls the findJobByIdDB which will lookup the database for job id matching the req.param (jobId).

---

PHASE 9: Application module

Questions--

<!-- Assignment 9.1 -->

## Can a Candidate Apply Twice?

No. There should be some candidate payload precisely Id that should be attached to an application so when a candidate tries to create an application, his id is ran through the database and only if null is returned can a new application be created.

## Can Employer Apply?

No, an employer can only create Jobs, and review applications. Only a candidate should be allowed to apply. To enforce this, the create application route would be protected by the restrictTo middleware.

Can Candidate Apply To Closed Job?
No. A closed job should signal an end to the availability of the Job and also it hiring process. Only active jobs can be applied for.

Future thoughts:
Closed jobs should only be visibe for 24 hours after their closed status is enacted, afterwards, they should remain in the database for records and reference purposes.

<!-- Assignment 9.2 -->

Application Status Lifecycle
introduce:
enum ApplicationStatus {
PENDING
REVIEWED
INTERVIEW
OFFERED
HIRED
REJECTED
WITHDRAWN
}

Flow:
PENDING -> REVIEWED -> INTERVIEW -> OFFERED -> HIRED

OR: REJECTED

Candidate may: WITHDRAW
before hiring

<!-- Assignment 9.4 -->

Validation Design
Questions:

## Cover Letter Length?

minimum: 20
maximum: 5000

## Status Validation?

Must be ApplicationStatus enum values only.

I also excluded the WITHDRAWN ApplicationStatus in the application dto and would include it in the candidate dto since it is an action performed by the candidate.

## Job ID?

Must be valid UUID

<!-- Assignment Design -->

Possible methods:
createApplicationDB()
findApplicationByIdDB()
findUserApplicationsDB()
findJobApplicationsDB()
updateApplicationStatusDB()
withdrawApplicationDB()
deleteAplicationsDB()
findApplicationByCandidateAndJobDB()

Note:

1. I also decided that only candidates with a completed profile and uploaded resume can create an application for a job

2. <!--

DeleteUser which is used to delete user, we can get the user id from the current session if the user is trying to delete their own account. One way to be sure is to have the user type in their password and like a text confirming they want their account deleted. If the delete is being done by an ADMIN, we need the user id or password

SuspendUser which can only be done by an ADMIN, is used to suspend a user from the platform. User ID or Email will do just fine

Note:
Since I started the application module implementation before the profile module and I wanted only candidates with complete profile and profile resume_Url to be able to apply to jobs, I created a profile repository as I didn't want to include database logic in my applicationService:import { prisma } from "../../../shared/config/prisma.js";

export async function findProfileByUserIdDB(userId: string) {
return prisma.profile.findUnique({
where: { userId },
select: { id: true, resume_Url: true },
});
}
then I created a profile.service:import { BaddRequestError } from "../../../shared/errors/badRequestError.js";
import { findProfileByUserIdDB } from "../repositories/profile.repositories.js";

export class ProfileServices {
async verifyCandidateReadyToApply(userId: string) {
const profile = await findProfileByUserIdDB(userId);

    if (!profile || !profile.resume_Url) {
      throw new BaddRequestError(
        "Please complete your profile and upload a resume before applying",
      );
    }
    return profile;

}
}

For the controller, because at this point I wanted to preserve every application for future purposes, I decided to exclude a deleteApplication controller handler. I wanted candidate to be only able to withdraw application which I achieved by simply creating a service that simply changes ApplicationStatus after candidate authentication of course.

<!-- Assignment 9.8 -->

Employer Application Access:
Can any Employer review any application?
No, an Employer can only review applications tied to a company he/she owns which is the purpose of the verifyCompanyOwnership...

<!-- 9.10 -->

All routes in the application module are protected via protectRoute as this is a very critical part of the business and contains very sensitive data.

I decided to place the /:jobId/apply and /:jobId/applications in the job.router.ts file to keep the architecture consistent (i.e., job related routes are placed in the job.router file)

while other application related routes like /me, /:applicationId/status, /:application/withdraw

<!-- Assignment 9.12 -->

Test Cases: Note I am yet to fully test my endpoint because the success of my application routes depends on if profile is completed and includes resume_Url which isn't currently available. I will commence to implementing the profile module next

---

Phase 10:

## Profile Module

<!-- The most basic question that the implementation of profile module should answer -->

What makes a candidate employable on TalentHub?

<!-- Assignment 10.1 -->

Profile Domanin Questions

## Can A user have multiple profiles?

No. One single profile per user. That way, the user integrity has the user Profile as it single source of truth. This would be defeated if one user can have multiple accounts.

## Can Employers have profile?

Yes. An employer is a user too and this profile serves a a user information center.

Can Admin have profiles?
Not necessary so no. Admin usually don't need: Profile, Resume, Skills, Experience

<!-- Assignment 10.2 -->

Review Current Profile Model:
Current:
Profile {
id
userId
bio
location
years_of_experience
resume_Url
skills
}

required:
bio, location, years_of_experience

Optional:
resume_Url

During creation but required before job application

<!-- Assignment 10.3 -->

DTO Design
Create:

CreateProfileDTO:

{
bio;
location;
years_of_experience;
resume_Url?;
skills;
}

UpdateProfileDTO
CreateProfileSchema.partial()

Note: On second thought, I decided everything was optional during creation aside from skills which has a default empty array. So, a candidate can create a partial profile first and add their resume_Url later via PATCH /profiles/me. However, only candidates with completed profile and resume_Url can apply for jobs

<!-- Assignment 10.5 -->

Repository Design

methods:
createProfileDB()

findProfileByIdDB() // No need for this as findProfielByUserIdDB does the returning of profile and also returns user data.

findProfileByUserIdDB()

updateProfileDB()

deleteProfileDB()

<!-- Assignment 10.6 -->

Service Design

ProfileServices:
createProfile()

getMyProfile()

updateProfile()

verifyCandidateReadyToApply()

NOTE: In the profileService.updateProfileService, I decided to engineer the handler in a model where the route is PATCH /profiles/me with no ownership check as I will place the protectRoute middleware before the controller. So, the protectRoute middleware only passes when the userId matches the currentUser.id because the userId is extracted from req.currentUser!.id

Also, I decided against a separate getMyProfileService as it has identical business logic as getProfileByUserIdService which fetches profile and throws a notFoundError("Profile not found") if it doesn't exist. So the controller would extract req.currentUser!id and pass it into profileService.getProfileUserIdService(userId).

<!-- Assignment 10.7 -->

Prevent Duplicate Profiles:
questions:
What if: Candidate already has profile, and tries POST /profile again?

Answer:
Return: 409 Conflict error "Profile already exists"

<!-- Assignment 10.8 -->

Ownership Rules

Can Candidate A update Candidate B profile?

Answer:
No, which is where the protectRoute which extracts userId from req.currentUser ensures that profile.userId of the candidate trying to initiates an update === current user Id. Meaning that profile updates can only be performed by the actual candidate that owns the profile or an ADMIN.

<!-- Assignment 10.9 -->

Public vs Protected

Should profiles be public:

No. I architected talentHub to only grant profile route accessibility to logged in users as I would say profiles contains very candidate specific data and should be treated as sensitive hence the implementation of authentication.

<!-- Assignment 10.10 -->

Resune Strategy:
I didn't implement upload for now, I just stored resume_Url. I intend to implement uploads via cloudinary URL soon after I complete all modules.

<!-- Assignment 10.11 -->

Profile Completion
I created a helper in profileServices that takes the profile (assigned the ProfileData type) as an argument, synchronously checks if the required fields are present, then returns a boolean. Making this helper synchronous spears the service the need to query the database as all fields via ProfileData type are made available to the profile parameter. I returned the result of this helper in the getProfileByUserId service which will be handy for frontend badge implementation of completed Profile.

<!-- Assignment 10.2 -->

Error Scenarios

Profile Not Found:

404 NotFoundError

Duplicate Profile:

409 ConflictError

Invalid Experience, Empty Skills,

400 BadRequestError

Unauthorized Access
403 UnauthorizedError

NOTE: I am holding off on implementing a user module as most of the user specific business logic are currently handled in the Auth, Profile, Company, Application module, which is completely fine for now.

I would most definitely start to implement a user module when I begin to implement:

Change Password

Deactivate Account

Delete Account

Update Email

Account Settings

Notification Preferences

Privacy Settings

Then I would introduce modules/user with something like:

user/
├── controllers
├── dto
├── repositories
├── routes
├── services
└── types

for:

GET /users/me

PATCH /users/me

PATCH /users/me/password

DELETE /users/me

PATCH /users/me/status

<!--

 (profile.dto.ts -> profile.types.ts -> profile.repositories.ts -> profile.services.ts -> profile.controllers.ts -> profile.routes.ts)

 -->

  <!-- 
  
  LinkedIn Posts Going Forward

And absolutely.

For future reference I'll point them out when I see them.

Examples of good future posts:

✅ JWT payload vs runtime user contract bug (the one you just posted)

✅ Why RBAC belongs in middleware but ownership belongs in services

✅ Building a reusable validation middleware with Zod

✅ Why repositories shouldn't contain business rules

✅ Designing public company/job discovery routes

✅ Service-to-service ownership verification

✅ Prisma + TypeScript pitfalls

✅ Implementing graceful shutdown in Node.js

✅ Building a CI pipeline for an Express + Prisma project

Those aren't "I built X" posts.

They're:

Plain Text
Problem
↓
Lessons Learned
↓
Solution

which generally perform much better among engineers.
  
   -->

   <!-- 
   
   What's Next?

If this were my project roadmap:

Plain Text
Phase 11
Bookmark Module

Candidates can save jobs.

Then:

Plain Text
Phase 12
Interview / Hiring Workflow

Then:

Plain Text
Phase 13
File Uploads (Cloudinary)

for:

Plain Text
Resume Upload
Company Logos

Then:

Plain Text
Phase 14
Notifications

Then:

Plain Text
Phase 15
Testing

(Jest / Vitest / Supertest)

because by then the domain is stable.

    -->
