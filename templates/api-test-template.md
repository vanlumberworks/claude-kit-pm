# API Test Report: [Endpoint Name]

**Endpoint**: `[METHOD] /api/path`
**Purpose**: [What this API does]
**Tested By**: [Your name]
**Date**: [Test date]
**Environment**: [Staging/Production]

---

## Test Summary

**Total Tests**: [X]
**Passed**: [X]
**Failed**: [X]
**Blocked**: [X]

**Ready for Production**: [Yes/No]

---

## Endpoint Specification

### Request
**Method**: [GET/POST/PUT/DELETE]
**URL**: `https://api.example.com/v1/resource`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body** (if applicable):
```json
{
  "field1": "value",
  "field2": 123
}
```

### Expected Response
**Status**: [200/201/etc.]
```json
{
  "success": true,
  "data": {
    "id": "res_123"
  }
}
```

---

## Test Cases

### 1. Happy Path - Valid Input
**Description**: Test with all required fields, valid data

**Request**:
```json
{
  "email": "test@example.com",
  "name": "John Doe"
}
```

**Expected**: 200 OK with user object
**Actual**: 200 OK with user object
**Status**: ✅ PASS

---

### 2. Validation - Missing Required Field
**Description**: Test without required field

**Request**:
```json
{
  "name": "John Doe"
}
```

**Expected**: 400 Bad Request with error message
**Actual**: 400 Bad Request, error: "email is required"
**Status**: ✅ PASS

---

### 3. Validation - Invalid Format
**Description**: Test with invalid email format

**Request**:
```json
{
  "email": "invalid-email",
  "name": "John Doe"
}
```

**Expected**: 400 Bad Request with validation error
**Actual**: 400 Bad Request, error: "invalid email format"
**Status**: ✅ PASS

---

### 4. Authentication - No Token
**Description**: Test without authentication

**Request**: [Same as happy path, but no auth header]

**Expected**: 401 Unauthorized
**Actual**: 401 Unauthorized
**Status**: ✅ PASS

---

### 5. Edge Case - Very Long Input
**Description**: Test with 10,000 character string

**Request**: [Include very long string]

**Expected**: 400 Bad Request with "input too long" error
**Actual**: 500 Internal Server Error
**Status**: ❌ FAIL - Should return 400, not 500

---

## Issues Found

### Issue 1: Very Long Input Causes 500 Error
**Severity**: P2 - Medium
**Description**: Sending a 10,000 character string causes a 500 error instead of proper validation error.
**Expected**: 400 Bad Request with clear error message
**Actual**: 500 Internal Server Error
**Impact**: Poor error handling for edge case
**Bug Ticket**: [JIRA-123]

---

## API Specification for PRD

```markdown
### API Endpoint: Create User

**Endpoint**: `POST /api/v1/users`
**Purpose**: Create a new user account

**Authentication**: Required - Bearer token

**Request Headers**:
- `Content-Type: application/json`
- `Authorization: Bearer {token}`

**Request Body**:
{
  "email": "string (required, valid email, max 100 chars)",
  "name": "string (required, max 50 chars)",
  "phone": "string (optional, E.164 format)"
}

**Success Response (201 Created)**:
{
  "success": true,
  "data": {
    "userId": "usr_123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-11-20T10:30:00Z"
  }
}

**Error Responses**:

400 Bad Request:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}

401 Unauthorized:
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}

409 Conflict:
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "Email already registered"
  }
}

**Rate Limiting**:
- Limit: 100 requests/hour per IP
- Headers: X-RateLimit-Remaining, X-RateLimit-Reset
- Exceeded: 429 Too Many Requests

**Side Effects**:
- Creates user record in database
- Sends welcome email
- Triggers analytics event: user_created

**Success Criteria**:
- Response time < 500ms (p95)
- Error rate < 1%
- Email delivery < 10 seconds
```

---

## Recommendations

1. **Add Input Length Validation**: Implement max length checks server-side to return 400 instead of 500 for very long inputs

2. **Improve Error Messages**: Make validation error messages more specific (e.g., "Email must be less than 100 characters")

3. **Add Rate Limiting Info**: Include rate limit headers in all responses, even successful ones

4. **Document Edge Cases**: Update API docs with max input lengths and constraints

---

## Postman Collection

**Collection Name**: User Management API
**Environment**: [Link to environment]
**Collection Link**: [Link to Postman collection]

**Included Requests**:
- Create User - Valid
- Create User - Missing Email
- Create User - Invalid Email
- Create User - No Auth
- Create User - Duplicate Email
- Create User - Edge Cases

---

## Next Steps

- [ ] File bug for Issue 1 (JIRA-123)
- [ ] Update API documentation with findings
- [ ] Retest after bug fixes
- [ ] Add to regression test suite
- [ ] Share results with engineering team
- [ ] Update PRD with API spec

---

## Test Evidence

**Screenshots**: [Link to folder]
**Postman Collection**: [Link]
**Screen Recording**: [Link to Loom video]

---

## Notes

[Any additional observations, questions, or context]
