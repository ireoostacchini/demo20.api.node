# Node API Best practices

The aim of this project is compile a list of Node best practices, and implement as many of them as possible in the code (these are prefixed with *).



## Architecture

- Adopt a ['clean' architecture](https://www.freecodecamp.org/news/a-quick-introduction-to-clean-architecture-990c014448d2/):
  - Controllers 
    - receive DTOs from requests; they perform initial validation and pass the DTOs down to the Business Logic layer
    - inject concrete implementations (e.g. Data Services, API Clients) into the Business Logic layer
  - The Business Logic layer 
    - maps DTOs to / from Entities, and uses them with the injected data / API services
    - has no knowledge of concrete implementation (data, external APIs, file system)
  - The Entities layer
    - contains classes representing domain objects
    - has no dependencies and no knowledge of concrete implementation or business logic
- !['](https://github.com/ireoostacchini/demo20.api.node/blob/master/docs/demo20.node.api.png)
- Delegate anything possible (e.g. gzip, SSL) to a reverse proxy)
- Measure and guard memory usage



## Code

- Use Conditional Requests -eg:
  - Last-Modified (to indicate when the resource was last modified)
  - Etag (to indicate the entity tag)
  - If-Modified-Since (used with the Last-Modified header)
  - If-None-Match (used with the Etag header)
- Use linters such as eslint and prettier, and add Node.js specific plugins like eslint-plugin-node
- *Separate Express 'app' and 'server'



## Error handling

- *Guard and restart the process upon failure (eg using PM2, or a platform service)
- [*It is not safe to resume normal operation after 'uncaughtException'](https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly). Restart the process carefully using a process management tool like PM2
- *Catch unhandled promise rejections



## Configuration

- *Ensure config keys can be read from file AND from environment variable

- *Ensure config is hierarchical for easier findability

- *Config secrets should be kept outside committed code

- *The application should fail as fast as possible and provide the immediate feedback if the required environment variables are not present at start-up



## Authentication

- Use JWT-Based, stateless authentication

- Support blacklisting JWTs
  - When using JSON Web Tokens (for example, with Passport.js), by default there's no mechanism to revoke access from issued tokens. Once you discover some malicious user activity, there's no way to stop them from accessing the system as long as they hold a valid token. Mitigate this by implementing a blacklist of untrusted tokens that are validated on each request.



## Security

- Inspect for vulnerable dependencies (eg npm audit and snyk.io)

- Inspect for outdated packages (e.g. 'yarn outdated' or npm-check-updates)

- *Embrace linter security rules (eg security-related linter plugins such as eslint-plugin-security)

- Prevent query injection vulnerabilities with ORM/ODM libraries

- Use SSL/TLS to encrypt the client-server connection (preferable at platform level)

- [Compare secret values and hashes securely](https://stackoverflow.com/questions/31095905/whats-the-difference-between-a-secure-compare-and-a-simple) 
- [Generate random strings](https://futurestud.io/tutorials/generate-a-random-string-in-node-js-or-javascript)
- Follow the [OWASP top 10 API vulnerabilities](https://owasp.org/www-project-api-security/):

  - Broken Object Level Authorization
  - Broken User Authentication
  - Excessive Data Exposure
  - Lack of Resources & Rate Limiting
  - Broken Function Level Authorization
  - Mass Assignment
  - Security Misconfiguration
  - Injection
  - Improper Assets Management
  - Insufficient Logging & Monitoring

- Have a security.txt File [PRODUCTION]

- Protect Personally Identifiable Information (PII Data) - GDPR

- Avoid using the Node.js crypto library for handling passwords, use Bcrypt /  Argon2

- Limit authorization attempts using two metrics:
  - The number of consecutive failed attempts by the same user unique ID/name and IP address
  - The number of failed attempts from an IP address

- Run Node.js as non-root user

- Limit payload size using a reverse-proxy or a middleware

- Configure 2FA for npm or Yarn

- Modify the default session middleware settings

- Set secure cookies

- Avoid DOS attacks by explicitly setting when a process should crash
  - There's no instant remedy for this but a few techniques can mitigate the pain:
    - Alert with critical severity anytime a process crashes due to an unhandled error
    - *Validate the input and avoid crashing the process due to invalid user input
    - *Wrap all routes with a catch
    - *Consider not to crash when an error originated within a request (as opposed to what happens globally)

- Avoid redirects that do not validate user input

- Avoid publishing secrets to the npm registry



## Logging / Monitoring

- *Discover errors and downtime using APM products
- *Don't route logs within the app - write logs to stdout using a logger utility and then let the execution environment pipe the stdout stream to the appropriate destination
- *Assign a transaction id to each log statement



## Testing

- *Collect unit test coverage measurements
- Add data per-test (e.g. use a separate API to load data into a database, and call it before each test)
- Use a production-like environment for e2e testing



## Documentation

- Document API errors using Swagger or GraphQL



## Build

- Be sure that production code uses the exact version of the packages you have tested it with
  - e.g. run npm ci to do a clean install matching package.json and package-lock.json.
- *Utilize all CPU cores (e.g. via PM2)



## Sources

- [10 Best Practices for Writing Node.js REST APIs](https://blog.risingstack.com/10-best-practices-for-writing-node-js-rest-apis/)
- [20 ways to become a better Node.js developer in 2020](https://medium.com/@me_37286/20-ways-to-become-a-better-node-js-developer-in-2020-d6bd73fcf424)
- [A quick introduction to clean architecture](https://www.freecodecamp.org/news/a-quick-introduction-to-clean-architecture-990c014448d2/)
- [Common Node.js security best practices](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/commonsecuritybestpractices.md)
- [JavaScript Stack 2020](https://gregberge.com/blog/javascript-stack-2020)
- [Make your code production-ready](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/productioncode.md)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [OWASP API Security Project](https://owasp.org/www-project-api-security/)



