Create Company

✅ Valid
Post http://localhost:5005/talenthub/api/v1/company

Auth Role: EMPLOYER(ACTIVE)

Request payload:
CreateCompanyInput (name, description ≥ 20 chars, industry, website, headquarters, size, optional logoUrl & foundedYear)

EXAMPLE:
{
"name": "RDG LTD",
"description": "Modernized interior designing",
"industry": "Interior design",
"website": "https://www.rdg.com",
"headquarters": "Owerri Nigeria",
"size": "SIZE_11_50",
"logoUrl": null,
"foundedYear": 2024

}

Expected Status: 201 created

Expected Behavior and Assertions:
Returns {status: "success", data: {company}}.
company.ownerId matches the employer's ID, and company.slug starts with the slugified name.

Auth Role: ❌ Candidate
CANDIDATE(ACTIVE)

payload: Valid CreateCompanyInput

Epected Status: 403 Forbidden

Expected Behavior and Assertions:
Blocked by restrictTo("EMPLOYER") middleware before hitting the controller or database.

✅ Duplicate Name (Allowed by design)

Auth Role: EMPLOYER(ACTIVE)

Request payload:
Valid payload with the exact same name as an existing company

Expected Status: 201 Created

Expected Behavior and Assertions:
Succeeds because name is not @unique. Asserts that newCompany.slug !== existingCompany.slug due to the random hex suffix.

❌ Missing Data

Auth Role: EMPLOYER(ACTIVE)

Request payload:
Missing required fields (e.g., omitted website or description < 20 xhars, or invalid size enum>)

Expected Status: 400 Validation Error

Update Company
Test Case: ✅ Owner

Auth Role & Ownership: EMPLOYER who owns :id

Route Param & Payload:
Valid UUID :id + partial payload (e.g., {website: "https://new.com", logoUrl: null})

Expected Status: 200 OK

Expected Behavior & Assertions:
Updates only the provided fields, clears logoUrl to null, preserves untouched fields, and regenerates slug if name changed.

Test Case: ❌ Non-owner

Auth Role & Ownership: EMPLOYER who owns a different company

Route Params & payload:
Valid UUID :id belonging to another employer + valid partial

Expected Status: 403 Forbidden

Expected Behavior & Assertions:
Passes restrictTo("ADMIN", "EMPLOYER") at the router, then rejected inside verifyCompanyOwnership (company.ownerId !== requesterId).

Test Case: ❌ Candidate

Auth Role & Ownership: CANDIDATE(ACTIVE)

Route Params & payload:
valid UUID :id + valid partial payload

Expected Status: 403 Forbidden

Expected Behavior & Assertions:
Blocked immediately by restrictTo("ADMIN", "EMPLOYER") middleware.

Get Company

Test Case: ✅ Existing Company

Auth Role:
Any authenticated User (CANDIDATE, EMPLOYER, or ADMIN)

Route Param (:id):
Valid UUID of an existing company

Expected Status: 200 OK

Expected Behavior & Assertions:
Returns { status: "success", data: { company } } matching the seeded company record.

Test Case: ❌ Invalid ID

Auth Role: Any authenticated User

Route Param:
Valid UUID od an existing company

Expected Status: 400 Validation error

Expected Behavior & Assertions:
validateParams(CompanyIdParamSchema) (z.uuid()) before Prisma queries PostgreSQL.

Test Cases: ❌ Non-Existent Valid UUID (Bonus edge case)

Auth Role: Any authenticated User

Route Param: Valid UUID v4 format that does not exist in DB

Expected Status: 404 Not Found

Expected Behavior & Assertions:
Passes validateParams, then getCompanyByIdService throws NotFoundError("Company not found")
