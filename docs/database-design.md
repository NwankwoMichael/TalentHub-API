enum UserStatus {
ACTIVE
SUSPENDED
DEACTIVATED
}

enum UserRole {
ADMIN
EMPLOYER
CANDIDATE
}

enum JobLocation {
REMOTE
HYBRID
ONSITE
}

enum JobType{
FULLTIME
PARTTIME
CONTRACT
}

enum JobStatus{
ISACTIVE
EXPIRED
}

enum ApplicationStatus {
PENDING
REVIEWED
INTERVIEW
OFFERED
HIRED
REJECTED
}

User {
id String @id @default(uuid())

email String @unique

password String

role UserRole @default(CANDIDATE) // We will enforce a UserRole.ADMIN restriction in the Nodejs code logic

status UserStatus @default(ACTIVE)

createdAt DateTime @default(now())

updatedAt DateTime @updatedAt

profile Profile?

bookmarks Bookmark[]

//I added a field for application to keep track of the applications made by a candidate (which I think better enables candidate to track application status)
applications Application[]
}

Profile {
id String @id @default(uuid())

userId String

user User @relation(fields: [userId], references: [id])

bio String @db.VARCHAR(1500)

location String

years_of_Experience Int

resume_Url String

skills String[]

}

Company {
id @id @default(uuid())

name String

website string

description String @db.VARCHAR(800)

logoUrl String?

ownerId String

owner User

}

Job {
id String @id @default(uuid())

title String

description String

salary Int

location JobLocation

status JobStatus

type JobType

companyId String

company Company

applications Application[]

bookmarks Bookmark[]

}

Application {
id @id @default(uuid())

UserId String

user User @relation(fields:[UserId], references: [id])

jobId String

job Job @relation(fields: [jobId], references: [id])

@unique([userId, jobId])

status ApplicationStatus @default(PENDING)

createdAt DateTime @default(now())

updatedAt DateTime @updatedAt

}

Bookmark {
id String @id @default(uuid())

userId String

user User @relation(fields: [userId], references: [id])

JobId String

job Job @relation(fields: [jobId], references: [id])

@unique([userId, jobId])

}

ASSIGNMENT 2.4

User <--> Profile:

One-to-One: A user should have only one profile that way when a user violates the platform policy and is suspended, user can't manuever suspension. Also, it becomes messy if a user applies for a job using multiple profile...

User <--> Application:
One-to-Many: One user can apply for multiple applications as Four different companies can post jobs that requires a candidate with devOps skill and the candidate with devOps skill can apply for these four jobs posted by different companies. However for a particular job, it is ideal for an application to be tied to just one user origin.

Company <--> Job:
One-to-many: A company can post multiple jobs for multiple entries but each job is tied to one source(company)

Job <--> Application:
One-to-many: for this relationship, a job will ideally attract multiple applications and also applications are tied to multiple jobs

<!-- The refined model shema structure for Talent Hub -->

enum UserStatus {
ACTIVE
SUSPENDED
DEACTIVATED
}

enum UserRole {
ADMIN
EMPLOYER
CANDIDATE
}

enum JobLocation {
REMOTE
HYBRID
ONSITE
}

enum JobType{
FULLTIME
PARTTIME
CONTRACT
}

enum JobStatus{
ACTIVE
CLOSED
EXPIRED
}

enum ApplicationStatus {
PENDING
REVIEWED
INTERVIEW
OFFERED
HIRED
REJECTED
}

model User {
id String @id @default(uuid())

email String @unique

password String

role UserRole @default(CANDIDATE)

status UserStatus @default(ACTIVE)

createdAt DateTime @default(now())

updatedAt DateTime @updatedAt

profile Profile?

companies Company[]

bookmarks Bookmark[]

applications Application[]
}

model Profile {
id String @id @default(uuid())

userId String @unique

user User @relation(fields: [userId], references: [id])

bio String

location String

years_of_Experience Int

resume_Url String

skills String[]

}

model Company {
id String @id @default(uuid())

name String

website String

description String

logoUrl String?

ownerId String

owner User @relation(fields: [ownerId], references: [id])

jobs Job[]

}

model Job {
id String @id @default(uuid())

title String

description String

salary Int

location JobLocation

status JobStatus

type JobType

companyId String

company Company @relation(fields: [companyId], references: [id])

applications Application[]

bookmarks Bookmark[]

}

model Application {
id String @id @default(uuid())

userId String

user User @relation(fields:[userId], references: [id])

jobId String

job Job @relation(fields: [jobId], references: [id])

@@unique([userId, jobId])

status ApplicationStatus @default(PENDING)

createdAt DateTime @default(now())

updatedAt DateTime @updatedAt

}

model Bookmark {
id String @id @default(uuid())

userId String

user User @relation(fields: [userId], references: [id])

jobId String

job Job @relation(fields: [jobId], references: [id])

@@unique([userId, jobId])

}
