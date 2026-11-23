Create Job (POST /talenthub/api/v1/jobs)

Test Case:
✅ Valid

Auth Role & Ownership:
EMPLOYER who owns companyId

Request Payload:
Valid CreateJobInput(companyId, title, description, location, workType, experienceLevel, salaryMin, salaryMax)

Expected Status:
201 created

Expected Behavior & Assertions:
Return {status: "success", data: {job}}.job.status defaults to "ACTIVE", job.slug is generated from title, and job.companyId matches.

Test Case:
❌ Candidate

Auth Role & Ownership:
CANDIDATE(ACTIVE)

Request Payload:
Valid CreateJobInput

Expected Status:
403 Forbidden

Expected Behavior & Assertions:
Blocked immediately by restrictTo("EMPLOYER, "ADMIN") before hitting controller or DB.

Test Case:
❌ Non-owner Employer

Auth Role & Ownership:
EMPLOYER who owns a different company

Requested Payload:
Valid CreateJobInput referencing someone else's companyId

Expected Status:
403 Forbidden

Expected Behavior & Assertions:
Passes restrictTo("EMPLOYER"), then rejected inside companyServices.verifyCompanyOwnership(company.ownerId !== requesterId).

Test Case:
❌ Company Missing

Auth Role & Ownership:
EMPLOYER who owns a different company

Requested Payload:
Valid CreateJobInput with a valid UUID v4 companyId that does not exist in DB

Expected Status:
404 Not Found

Expected Behavior & Assertions:
Rejected inside verifyCompanyOwnership with NotFoundError("Company not found").

Update Job (PATCH /talenthub/api/v1/jobs/:id)

Test Case:
✅ Owner

Auth Role & Ownership
EMPLOYER who owns the job's parent company

Route Param & payload:
Valid UUID :id + partial payload (e.g., {status: "CLOSED", salaryMax: 150000})

Expected Status:
200 OK

Expected Behavior & Assertions:
Updates provided fields, enforces salaryMax >= salaryMin across existing + incoming values, and regenerates slug if title changed

Test Case:
❌ Non-owner

Auth Role & Ownership:
EMPLOYER who does not own the parent company

Route Param & payload:
Valid UUID :id + valid partial payload

Expected Status:
403 Forbidden

Expected Behavior & Assertions:
verifyJobOwnership -> verifyCompanyOwnership.

Get Job (GET /talent/api/v1/jobs/:id)

Test Case:
✅ Existing

Auth Role:
Guest (unauthenticated or any authenticated user)

Route Param(:id):
Valid UUID of an existing job

Expected Status:
200 OK

Expected Behavior & Assertions:
Returns { status: "success", data: {job}}.

Test Case:
❌ Missing

Auth Role:
Guest or any authenticated user

Route Param (:id):
Valid UUID v4 that does not exist in DB (or malformed Id)

Expected Status:
404 Not Found (or 400 Bad Request id invalid UUID format)

Expected Behavior & Assertions:
validateParams catches malformed UUIDs (400), while getJobByIdService throws NotFoundError("Job not found") (404) for non-existent UUIDs.

Delete Job (DELETE /talenthub/api/v1/jobs/:id)

Test Case:
✅ Admin

Auth Role & ownership:
ADMIN

Pre-condition & Route Param:
Valid UUID :id of a job with O applications

Expected Status:
204 No content

Expected Behavior & Assertions:
Bypasses ownership check via requesterRole !== "ADMIN" and deletes the job record.

Test Case:
✅ Owner

Auth Role & ownership:
EMPLOYER who owns the parent company

Pre-condition & Route Param:
Valid UUID :id of a job with 0 applications

Expected Status:
204 No Content

Expected Behavior & Assertions:
verifyJobOwnership and deletes the job record. (Note: if applications exists, returns 404 Validation Error because OnDelete: Cascade is intentionally omitted.)

Test Case:
❌ Non-owner

Auth Role & ownership:
EMPLOYER who does not own the parent company

Pre-condition & Route Param:
Valid UUID :id

Expected Status:
403 Forbidden

Expected Behavior & Assertions:
verifyJobOwnership before reaching countApplicationsDB or deleteJobDB.
