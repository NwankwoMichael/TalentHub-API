Postman Test Matrix (/talenthub/api/v1)

✅ Apply
Test Case: Apply(No Profile/Resume)

Method & Endpoint: POST /jobs/:activeJobId/apply

Auth Token: CANDIDATE(no profile)

Request Body / Query: {"coverLetter":"Excited to join the engineering team..."}

Expected Status & Behavior: 400 Bad Request ("Please complete your profile and upload a resume before applying)

Test Case: Apply (Happy Path)

Method & Endpoint: POST /jobs/:activeJobId/apply

Auth Token: CANDIDATE(with resume_Url)

Request Body / Query: {"coverLetter": "Excited to join the engineering team..."} (or {})

Expected Status & Behavior: 201 Created - returns application with status: "PENDING"

✅ Duplicate Application

Test Case: Duplicate Application

Method & Endpoint: POST /jobs/:activeJobId/apply

Auth Token: CANDIDATE(same user)

Request Body / Query: {"coverLetter": "Applying a second time..."}

Expected Status & Behavior: 400 Bad Request ("You have already applied to this job")

✅ Closed Job

Test Case: Closed Job

Method & Endpoint: POST /jobs/:closedJobId/apply

Auth Token: CANDIDATE (with resume_Url)

Request Body / Query: {"coverLetter": "Applyinf to a closed job..."}

Expected Status & Behavior: 400 Bad Request { "This job is no longer accepting applications" }

✅ Candidate Access

Test Case: Candidate Access (Own Apps)

Method & Endpoint: GET /applications/me?page=1&limit=10

Auth Token: CANDIDATE

Request Body / Query: (Optional: &status=PENDING)

Expected Status & Behavior: 200 OK - returns applications (with nested job + company) and pagination

Test Case: Candidate Access (Blocked from Employer routes)

Method & Endpoint: GET /jobs/:activeJobId/applications & PATCH /applications/:applicationId/status

Auth Token: CANDIDATE

Request Body / Query: {"status": "HIRED}

Expected Status & Behavior: 403 Forbidden (blocked by restrictTo("EMOLOYER", "ADMIN"))

✅ Employer Access

Test Case: Employer Access (Owner)

Method & Endpoint: GET /jobs/:activeJobId/applications

Auth Token: EMPLOYER (company owner)

Request Body / Query: (Optional: ? status=PENDING)

Expected Status & Behavior: 200 OK - returns applications (with nested user email + profile, no password) and pagination

Test Case: EMPLOYER Blocked from Candidate Routes

Method & Endpoint: POST /jobs/:activeJobId/apply & GET /applications/me

Auth Token: EMPLOYER

Request Body / Query: {}

Expected Status & Behavior: 403 Forbidden (blocked by restrictTo("CANDIDATE"))

✅ Update Status

Test Case: Update Status(Happy Path)

Method & Endpoint: PATCH /applicatioons/:applicationId/status

Auth Token: EMPLOYER (company owner)

Request Body / Query: { "status": "INTERVIEW" }

Expected Status & Behavior: 200 OK - returns updated application with status: "INTERVIEW"

Test Case: Update Status(Invalid Value)

Method & Endpoint: PATCH /applications/:applicationId/status

Auth Token: EMPLOYER (company owner)

Request Body / Query: { "status": "WITHDRAWN"}

Expected Status & Behavior: 400 / 422 ValidationError (WITHDRAWN id excluded from UpdateApplicationStatusSchema)

✅ Withdraw

Test Case: Withdraw (Wrong Candidate)

Method & Endpoint: PATCH /applications/:applicationId/withdraw

Auth Token: CANDIDATE (different User)

Request Body / Query: -

Expected Status & Behavior: 403 Forbidden ("Access denied")

Test Case: Withdraw (Happy Path)

Method & Endpoint: PATCH /applications/:applicationId/withdraw

Auth Token: CANDIDATE (applicant)

Request Body / Query: -

Expected Status & Behavior: 200 OK ("Application withdrawn successfully")

Test Case: Withdraw again /Update After Withdraw

Method & Endpoint: PATCH /applications/:applicationId/withdraw or PATCH /applications/:applicationId/status

Auth Token: CANDIDATE or EMPLOYER

Request Body / Query: { "status": "REVIEWED"}

Expected Status & Behavior: 400 Bad Request ( "Application has already been withdrawn" / "Cannot update the status of a withdrawn application")
