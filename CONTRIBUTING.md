# Contributing to CareChain

Thank you for your interest in contributing to **CareChain**! As an enterprise-grade healthcare protocol, we enforce high standards of code hygiene, cryptographic safety, and testing rigor.

---

## 1. Code of Conduct
We are committed to providing a welcoming, inclusive, and harassment-free environment. All contributors are expected to uphold professional and respectful conduct.

---

## 2. Development Workflow & Monorepo Setup

### Prerequisites
- Node.js `>= 18.0.0`
- npm `>= 9.0.0`
- Docker (optional, for containerized local services)

### Setup Instructions
```bash
# 1. Clone repository
git clone https://github.com/your-org/carechain.git
cd carechain

# 2. Install monorepo dependencies
npm install

# 3. Run smart contract test suite
npm run test:contracts

# 4. Start local development
npm run start:backend  # terminal 1
npm run start:frontend # terminal 2
```

---

## 3. Commit Message Conventions
We follow the **Conventional Commits** specification (`<type>(<scope>): <subject>`):

- `feat`: A new user-facing feature or capability.
- `fix`: A bug fix.
- `docs`: Documentation updates.
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Build processes, tooling, or package updates.

**Examples**:
- `feat(contracts): add time-locked emergency access grant`
- `fix(backend): correct JWT expiration validation in authMiddleware`
- `docs(api): update OpenAPI response schema for /records`

---

## 4. Pull Request Checklist

Before submitting a Pull Request, ensure:
1. All smart contract tests pass with 100% success (`npm run test:contracts`).
2. Production frontend build succeeds with zero errors or warnings (`npm run build:frontend`).
3. No secrets, API keys, or private credentials are included in code or commits.
4. Clean branch name: `feature/short-description` or `fix/short-description`.
