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

The rule of whether a candidate not being permited should be handled in the bussiness logic which is in services.

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

<!--

1. Edit schema.prisma

2. npx prisma validate

3. npx prisma migrate dev --name meaningful_name

4. npx prisma generate

5. Run your TypeScript code

 -->

 <!-- 
 
 DeleteUser which is used to delete user, we can get the user id from the current session if the user is trying to delete their own account. One way to be sure is to have the user type in their password and like a text confirming they want their account deleted. If the delete is being done by an ADMIN, we need the user id or password

SuspendUser which can only be done by an ADMIN, is used to suspend a user from the platform. User ID or Email will do just fine

findAllUser which is used to get all users in the database, we just need to run an equivalent of SELECT ALL FROM the user table 
 
  -->
