# Employee portal & admin login

Secure staff access to `/internal/*` with a dedicated employee login flow and landing-page entry points.

## Architecture

```
Landing page ──► /employee/login ──► NextAuth (credentials)
                         │                    │
                         │              role in JWT
                         ▼                    ▼
                   Staff gate          Middleware (edge)
                   InternalStaffGate   isStaffRole(role)
                         │
                         ▼
              /internal (sidebar portal)
```

| Layer | File | Purpose |
|-------|------|---------|
| Employee login UI | `/employee/login` | Staff-only sign-in, remember me |
| Session check | `GET /api/employee/session` | Verifies staff role after login |
| Edge middleware | `auth.config.ts` | Blocks non-staff from `/internal` |
| Server gate | `InternalStaffGate` | DB role check on every internal page |
| API gate | `requireInternalPermission()` | Per-route permission checks |

Regular users sign in at `/login` → `/dashboard`.  
Employees sign in at `/employee/login` → `/internal`.

## Landing page access

- **Nav:** “Employee login” (desktop, subtle text link)
- **Footer:** secondary link
- **Homepage:** floating “Employee” pill (bottom-right, homepage only)

## Roles

| Role | Portal access |
|------|---------------|
| `user` | Blocked → employee login |
| `support_staff` | Overview, users, feedback, basic analytics |
| `moderator` | + feedback manage, tags |
| `admin` / `super_admin` | Full access + user access controls |

## Portal sections

| Route | Feature |
|-------|---------|
| `/internal` | Overview KPIs |
| `/internal/analytics` | Charts, CSV export |
| `/internal/users` | CRM search & profiles |
| `/internal/staff` | Invite employees & assign roles (admin+) |
| `/internal/feedback` | Feedback inbox |

## Security

- Same bcrypt + NextAuth JWT as regular users
- Staff role stored in JWT for middleware; re-validated from DB in APIs
- `STAFF_LOGIN` and portal views logged via `AdminAction`
- Rate limits on auth endpoints (existing)
- `User.mfaEnabled` reserved for future 2FA

## Setup staff account

**Recommended — Admin UI (production):**

1. Sign in as an admin at `/login`
2. Open **Employees** → `/internal/staff`
3. Invite by name, email, and role (temporary password shown once)
4. Employee signs in at `/login?callbackUrl=/internal`

**Script (local / bootstrap):**

```bash
npm run db:seed-user
# dev@anyexameasy.test / DevPassword1! — admin role + premium (default)
```

You can also promote any existing customer from **Users** → profile → **Staff role** (admin only).

Sign out and sign in again after role changes so the JWT picks up the new role.

## Deployment

No extra env vars. Ensure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set. Employee login page is `noindex` for SEO.
