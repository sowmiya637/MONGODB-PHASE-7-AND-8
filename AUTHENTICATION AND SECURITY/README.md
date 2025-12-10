
#  Authentication & Security — Complete Guide

##  Overview
This module covers the core concepts required to implement secure authentication and protect modern web applications from attacks.

Topics included:
- Password Hashing
- JWT Tokens
- Session Authentication
- Cookie Management
- OAuth 2.0
- Third-party Login (Google/GitHub)
- Security Best Practices (CORS, Helmet, Validation, etc.)
- SQL Injection Prevention
- XSS Protection
- Rate Limiting
- HTTPS & SSL/TLS

---

# 🔐 1. Authentication Concepts

## 1.1 Password Hashing (bcrypt, argon2)
Passwords must **never** be stored in plaintext.

**Why hash passwords?**
- Protects users even if database leaks  
- Prevents reverse engineering  
- Makes brute-force attacks slow  

**Hashing libraries**
- **bcrypt** → Salt rounds, widely used  
- **argon2** → Strongest, modern choice  

**Example (bcrypt)**
```js
const hashed = await bcrypt.hash(password, 10);
````

---

## 1.2 JWT Tokens (JSON Web Tokens)

JWT is a stateless authentication mechanism.

**When to use JWT:**

* Mobile apps
* SPAs (React/Vue/Angular)
* API-only backends

**Token contains:**

* User ID
* Expiration
* Optional: Role

**Flow**

1. User logs in
2. Server signs a token
3. Client stores token (localStorage/cookie)
4. Client sends token in headers
5. Server verifies token

---

## 1.3 Session-Based Authentication

Sessions are stored **on the server**.

**When to use:**

* Traditional websites
* Apps requiring strong security
* When logout must invalidate immediately

Sessions use cookies containing a **session ID**.

---

## 1.4 Cookie Management

Cookies store:

* Sessions
* Tokens (prefer httpOnly)
* CSRF tokens

**Secure cookie flags**

| Flag       | Purpose                 |
| ---------- | ----------------------- |
| `httpOnly` | JS cannot access cookie |
| `secure`   | Only sent via HTTPS     |
| `sameSite` | Prevents CSRF           |

**Example**

```js
res.cookie("token", jwt, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
});
```

---

# 🌐 2. OAuth 2.0 & Third-Party Login

## 2.1 OAuth 2.0 Basics

Allows login via providers like:

* Google
* GitHub
* Facebook

**Flow**

1. Redirect to provider
2. User logs in
3. Provider returns an authorization code
4. Server exchanges code for access token
5. Server fetches user profile

---

## 2.2 Third-Party Login Examples

Common libraries:

* `passport-google-oauth20`
* `passport-github2`

---

# 🔒 3. Security Best Practices

## 3.1 CORS Configuration

Prevents unauthorized domains from calling your API.

```js
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
```

---

## 3.2 Helmet.js (Security Headers)

Protects against:

* Clickjacking
* MIME sniffing
* XSS

```js
app.use(helmet());
```

---

## 3.3 Input Validation & Sanitization

Protects against invalid or malicious input.

**Libraries:**

* `joi`
* `express-validator`
* `validator.js`

Example:

```js
body("email").isEmail();
body("password").isStrongPassword();
```

---

## 3.4 SQL/NoSQL Injection Prevention

NoSQL injections can occur in MongoDB.

Attack example:

```
{ "$gt": "" }
```

Prevention:

* Validate input
* Sanitize request bodies
* Use strict schema validation

---

## 3.5 XSS Protection

Prevents execution of malicious JavaScript.

**Prevention methods**

* Sanitize HTML
* Escape user input
* Use Helmet XSS filters

---

## 3.6 Rate Limiting

Stops brute-force login attempts.

```js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api", limiter);
```

---

## 3.7 HTTPS & SSL/TLS

Encrypts communication between client and server.

**Always use:**

* HTTPS
* Secure cookies
* TLS certificates

Enable Express proxy trust:

```js
app.enable("trust proxy");
```




Just tell me!
```
