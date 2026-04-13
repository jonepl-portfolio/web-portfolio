---
name: test-writer
description: Writes Jest + Supertest tests for the mail-server Express API
tools: Read, Write, Bash
---
Write tests using Jest and Supertest matching patterns in mail-server/
Focus on: /send-email POST (valid, invalid, rate-limited cases), 
Zod validation errors, and environment variable edge cases.
Run `npm test` after writing to confirm passing.