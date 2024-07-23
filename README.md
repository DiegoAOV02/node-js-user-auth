# User authentication using sessions, cookies and JWT with Node.js and Express.js

This projects tries to show how to implement user authentication using sessions, cookies and JWT by using good practices and security measures.

## Features

- User authentication by using sessions, cookies and JWT
- User login
- User registration
- JWT-based authentication
- Protected routes
- Cookies-based authentication

## Dependencies installed

This are all the dependencies installed in this project:
```bash
# 1. Express instalation
npm install express

# 2. Standard instalation to check code style (optional)
npm install standard -D

# 2.1 Standard configuration in package.json
"eslintConfig": {
  "extends": "standard"
}

# 3. Local Database instalation
npm install db-local

# 4. Bcrypt to hash passwords
npm install bcrypt

# 5. EJS dependency instalation
npm install ejs

# 6. JWT instalation
npm install jsonwebtoken

# 7. Cookie-parser instalation
npm install cookie-parser

```

## Endpoints

- **GET /**: Home page
- **POST /login**: Login page to authenticate users by using JWT and HTTP-only cookies
- **POST /register**: Register page to create new users in the database
- **POST /logout**: Logout page to remove the session and the cookie
- **GET /protected**: Protected route that requires authentication to access it (JWT and cookies)