# saas-nextjs-prisma

![CI](https://github.com/Shaisolaris/saas-nextjs-prisma/actions/workflows/ci.yml/badge.svg)

Next.js 14 SaaS with Prisma and Resend for transactional email workflows. Features email templates with variable substitution, contact management with tags, email send/delivery logging with open/click tracking, and a multi-step workflow engine for email automation.

## Stack

- **Framework:** Next.js 14 App Router, TypeScript
- **Database:** Prisma (PostgreSQL)
- **Email:** Resend API
- **Validation:** Zod

## Features

### Email Templates
4 built-in templates with `{{variable}}` substitution: welcome, passwordReset, teamInvite, weeklyDigest. Each template declares its required variables for validation.

### Email Delivery
- Send via Resend API with from/to/subject/html
- Template rendering with variable substitution
- Email log persistence with Resend message ID
- Track status: queued, sent, opened, clicked

### Contact Management
- Per-user contact lists with email uniqueness
- Tags array for segmentation
- JSON metadata for flexible attributes
- Active/unsubscribed status

### Workflow Engine
- Multi-step workflows: send_email, wait, condition, update_contact
- Trigger-based execution
- Step-by-step result tracking
- Active/inactive toggle

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/email` | Send templated email, log delivery |
| GET | `/api/email?userId=` | Get email logs for user |
| GET | `/api/users` | List users with contact/email/workflow counts |
| POST | `/api/users` | Create user |

## Database Schema (Prisma)

```
User          → id, email, name, role, verified, contacts, emailLogs, workflows
Contact       → id, userId, email, name, tags[], metadata (JSON), status
EmailTemplate → id, name, subject, body, variables[]
EmailLog      → id, userId, to, subject, templateId, status, resendId, openedAt, clickedAt, sentAt
Workflow      → id, userId, name, trigger, steps (JSON), isActive
```

## Setup

```bash
git clone https://github.com/Shaisolaris/saas-nextjs-prisma.git
cd saas-nextjs-prisma
npm install
npx prisma generate && npx prisma db push
# Add RESEND_API_KEY to .env
npm run dev
```

## License

MIT
