## TalentHub API

TalentHub is a backend recruitment platform that bridges the gap between job seekers and employers. Candidates can create professional profiles, search and apply for jobs, while employers can publish job openings, review applications, and manage hiring workflows.

This project is built as a modular monolith using Node.js, TypeScript, Prisma, and PostgreSQL to demonstrate modern backend engineering practices, including authentication, role-based access control, Dockerized deployments, and CI/CD automation.

## Tech Stack:

Node.JS, Typescript, Express, PostgreSQL

## Project Structure:

src/
|
-> docs/
|
-> modules/
|
-> shared/
|

- -> configs
  |
- -> middleware
  |
- -> types
  |
- -> utils
  |
  -> tests
  |
  -> app.ts
  |
  -> server.ts
  |
  ->
  .env.example
  |
  -> package-lock.json
  |
  -> package.json
  |
  -> README.md
  |
  -> tsconfig.json

## Development Setup:

Runtime & Engines:

Node.js => 26.6.6
TypeScript => 7.0.2
Express => 5.0.6
tsx: => 4.23.15

Package Manager:
NPM

## Installation:

Cloning the repo: git clone https://github.com/NwankwoMichael/TalentHub-API.git

Navigate into folder: cd TalentHub-API

Installing depandencies: npm install
