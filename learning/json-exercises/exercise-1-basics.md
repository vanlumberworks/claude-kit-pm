# JSON Exercise 1: Basics

## Learning Objectives
- Identify the 6 JSON data types
- Read simple JSON structures
- Spot common syntax errors
- Understand key-value pairs

---

## Exercise 1: Identify Data Types

For each value, identify its type:

```json
{
  "name": "Alice",
  "age": 30,
  "isActive": true,
  "middleName": null,
  "hobbies": ["reading", "coding"],
  "address": {
    "city": "Boston"
  }
}
```

**Questions**:
1. What type is `"name"`?
2. What type is `age`?
3. What type is `isActive`?
4. What type is `middleName`?
5. What type is `hobbies`?
6. What type is `address`?

**Answers**:
1. String (text in quotes)
2. Number (no quotes)
3. Boolean (true/false)
4. Null (empty/nothing)
5. Array (list in square brackets)
6. Object (container in curly braces)

---

## Exercise 2: Spot the Errors

Find and fix the errors in this JSON:

```json
{
  "product": {
    "name": 'Widget',
    "price": 29.99,
    "inStock": true,
  }
  "category": "Electronics"
}
```

**Errors to Find**: (Try before checking answers)
1. ?
2. ?
3. ?

**Answers**:
1. Line 3: Single quotes should be double quotes → `"name": "Widget"`
2. Line 5: Trailing comma after `true` → Remove the comma
3. Line 6: Missing comma after closing brace → Add comma after `}`

**Corrected Version**:
```json
{
  "product": {
    "name": "Widget",
    "price": 29.99,
    "inStock": true
  },
  "category": "Electronics"
}
```

---

## Exercise 3: Read and Answer

Given this JSON, answer the questions:

```json
{
  "user": {
    "userId": "usr_456",
    "name": "Bob Smith",
    "email": "bob@example.com",
    "subscription": {
      "plan": "premium",
      "status": "active",
      "price": 29.99
    },
    "projects": [
      "Project A",
      "Project B",
      "Project C"
    ]
  }
}
```

**Questions**:
1. What is the user's ID?
2. What subscription plan does the user have?
3. How many projects does the user have?
4. What is the subscription price?
5. Is the subscription active?
6. What are the names of all projects?

**Answers**:
1. usr_456 (found at user.userId)
2. premium (found at user.subscription.plan)
3. 3 projects (array has 3 items)
4. 29.99 (found at user.subscription.price)
5. Yes, it's "active" (found at user.subscription.status)
6. Project A, Project B, Project C (items in user.projects array)

---

## Exercise 4: Write Your Own JSON

Create a JSON object for a book with these properties:
- Title: "The Product Manager's Guide"
- Author: "Jane Doe"
- Published year: 2024
- Pages: 350
- Is available: true
- Genres: Array with "Business", "Technology"
- Publisher: Object with name "Tech Press" and location "San Francisco"

**Try it yourself first!**

**Solution**:
```json
{
  "book": {
    "title": "The Product Manager's Guide",
    "author": "Jane Doe",
    "publishedYear": 2024,
    "pages": 350,
    "isAvailable": true,
    "genres": ["Business", "Technology"],
    "publisher": {
      "name": "Tech Press",
      "location": "San Francisco"
    }
  }
}
```

**Key Points**:
- Strings use double quotes
- Numbers don't use quotes
- Booleans are lowercase true/false
- Arrays use square brackets []
- Objects use curly braces {}
- Commas between items (but not after last item)

---

## Exercise 5: Real-World API Response

This is a typical API response. Practice reading it:

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "orderId": "ORD-001",
        "total": 99.99,
        "status": "shipped"
      },
      {
        "orderId": "ORD-002",
        "total": 149.99,
        "status": "processing"
      }
    ],
    "totalCount": 2
  },
  "pagination": {
    "page": 1,
    "perPage": 10,
    "hasMore": false
  }
}
```

**Questions**:
1. Was the API request successful?
2. How many orders are in this response?
3. What is the status of order ORD-001?
4. What is the total for order ORD-002?
5. Are there more pages of results?
6. What page are we on?

**Answers**:
1. Yes (success: true)
2. 2 orders (data.totalCount: 2, also array has 2 items)
3. shipped (first order's status)
4. 149.99 (second order's total)
5. No (pagination.hasMore: false)
6. Page 1 (pagination.page: 1)

---

## Practice Challenge

### Scenario
You're working with a user management API. The engineering team shares this response format. Read it and explain what information is available:

```json
{
  "user": {
    "id": 123,
    "email": "pm@company.com",
    "profile": {
      "firstName": "Alex",
      "lastName": "Johnson",
      "title": "Senior Product Manager",
      "avatar": "https://example.com/avatars/alex.jpg"
    },
    "permissions": ["read", "write", "admin"],
    "lastLogin": "2024-11-20T10:30:00Z",
    "accountAge": 365,
    "isPremium": true
  }
}
```

**Your Task**:
Write 5 observations about this user based on the JSON:
1. ?
2. ?
3. ?
4. ?
5. ?

**Example Answers**:
1. User's email is pm@company.com
2. User has admin permissions (in permissions array)
3. User is a premium account (isPremium: true)
4. User last logged in on Nov 20, 2024 at 10:30 UTC
5. Account is 365 days old (about 1 year)

---

## Next Steps

- ✅ Complete Exercise 1
- → Move to Exercise 2: Nested Objects
- → Practice with real API responses
- → Take the JSON quiz

**Need Help?**
- Review: `./.claude/skills/json-fundamentals.md`
- Validate your JSON: jsonlint.com
- Ask questions in team chat

**Ready for More?**
Complete `/learn-json` to access all lessons and get certified!
