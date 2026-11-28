Create Profile

Test Case: ✅ Valid

Method & Endpoint: POST /profile/me

Auth Token: CANDIDATE (complete profile)

Request Body: { "bio": "Backend engineer specializing in Node.js and PostgreSQL.", "skills": ["Node.js", "TypeScript", "PostgreSQL"] }

Expected Status & Behavior: 201 Created — returns profile

Test Case: ❌ Partial - No Resume

Method & Endpoint: Post /profile/me

Auth Token: CANDIDATE

Request Body: { "bio": "Backend engineer specializing in Node.js and PostgreSQL.", "skills": ["Node.js", "TypeScript", "PostgreSQL"] }

Expected Status & Behavior: 201 Created - returns profile with resume_Url: null. (Great for testing POST /job/:id/apply -> 400 Bad Request before uploading a resume!)

Test Case: ❌ Duplicate

Method & Endpoint: Post /profile/me

Auth Token: CANDIDATE (same user)

Request Body: { "skills": ["React"] }

Expected Status & Behavior: 409 Conflict ("Profile already exists for this user")

Test Case: ❌ Invalid data

Method & Endpoint: POST /profile/me

Auth Token: CANDIDATE (new user)

Request Body: { "skills": ["Node.js", "node.js"] } (or empty [])

Expected Status & Behavior: 400 / 422 ValidationError ("Duplicate skills are not allowed" / "Please add at least one skill")

Update Profile

Test Case: ✅ Owner

Method & Endpoint: PATCH /profile/me

Auth Token: CANDIDATE

Request Body: { "location": "Abuja, Nigeria", "years_of_experience": 0, "resume_Url": "https://example.com" }

Expected Status & Behavior: 200 OK — returns updated profile. (Verifies years_of_experience: 0 is accepted.)

Test Case: ❌ Non-owner

Method & Endpoint: PATCH /profile/me

Auth Token: CANDIDATE (another user)

Request Body: { "location": "Abuja, Nigeria", "years_of_experience": 0, "resume_Url": "https://example.com" }

Expected Status & Behavior: 403 Unauthorized You don't have access

Get Profile

3b Get My Profile (Complete) GET /profile/me CANDIDATE (after update) — 200 OK — returns profile with isComplete: true (confirms 0 years doesn't trigger falsy bug)

Test Case: ✅ Existing

Method & Endpoint: GET /profile/me

Auth Token: CANDIDATE (after update)

Request Body: -

Expected Status & Behavior: 200 OK - returns profile with isComplete: true

Test Case: Incomplete

Method & Endpoint: GET /profile/me

Auth Token: CANDIDATE (partial profile) - 200 OK - returns profile with isComplete: false

Test Case: ❌ Missing

Method & Endpoint: GET /profile/me

Auth Token: CANDIDATE (No profile yet)

Request Body: -

Expected Status & Behavior: 404 Not Found ("Profile not found")

Test Case: ✅ Employer View Candidate

Method & Endpoint: GET /profile/:candidateUserId

Auth Token: EMPLOYER

Request Body: -

Expected Status & Behavior: 200 OK — returns candidate's profile with isComplete: true

Test Case: ❌ Candidate Blocked from Viewing Others

Method & Endpoint: GET /profile/:otherUserId CANDIDATE

Auth Token: CANDIDATE

Request Body: -

Expected Status & Behavior: 403 Forbidden (blocked by restrictTo("EMPLOYER", "ADMIN"))

Test Case: ❌ Employer Blocked from /me Routes

Method & Endpoint: POST /profile/me or GET /profile/me

Auth Token: EMPLOYER

Request Body: { "skills": ["Management"] }

Expected Status & Behavior: 403 Forbidden (blocked by restrictTo("CANDIDATE"))

Test Case: Delete My Profile

Method & Endpoint: DELETE /profile/me

Auth Token: CANDIDATE

Request Body: —

Expected Status & Behavior: 200 OK ("Profile deleted successfully") — subsequent GET /profile/me returns 404 Not Found

Resume Validation (Not tested yet)

Test Case: ✅ Valid URL

Method & Endpoint:

Auth Token: CANDIDATE (new user)

Request Body:

Expected Status & Behavior:

Test Case: ❌ Invalid URL

Method & Endpoint:

Auth Token: CANDIDATE (new user)

Request Body:

Expected Status & Behavior:

Postman Test Matrix (/talenthub/api/v1/profile)

# Test Case Method & Endpoint Auth Token Request Body Expected Status & Behavior
