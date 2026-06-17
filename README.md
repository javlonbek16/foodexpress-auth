# FoodExpress — Auth Service

> **Texnologiya:** Node.js / NestJS · PostgreSQL (`auth_db`) · Port `3001`
> **Markaziy hujjatlar:** [foodexpress-docs](https://github.com/javlonbek16/foodexpress-docs) — ishni shu repodan boshlang.

## 1. Servis maqsadi

Auth — butun platformaning **yagona token chiqaruvchisi**. Ro'yxatdan o'tish, login, JWT (access + refresh) va RBAC (rol/permission) shu yerda. Boshqa servislar token chiqarmaydi — faqat tekshiradi.

## 2. Talablar (intern nima qilishi kerak)

### Funksional
- [ ] Ro'yxatdan o'tish (`POST /auth/register`) — email + parol, parol **hash** (bcrypt/argon2).
- [ ] Login (`POST /auth/login`) — to'g'ri bo'lsa `access_token` + `refresh_token` qaytaradi.
- [ ] Token yangilash (`POST /auth/refresh`) — yaroqli refresh token → yangi access token.
- [ ] Logout (`POST /auth/logout`) — refresh tokenni bekor qilish (DB'dan o'chirish/blacklist).
- [ ] Profil (`GET /auth/me`) — joriy foydalanuvchi.
- [ ] RBAC: rol → permissionlar bog'lanishi. Login'da JWT ichiga `role` va `permissions[]` joylanadi.
- [ ] Admin: foydalanuvchilar ro'yxati (`user.manage`), rol o'zgartirish (`role.manage`).

### Texnik
- [ ] JWT: HS256, `JWT_SECRET` `.env` dan. Access TTL ~15 daq, refresh ~7 kun.
- [ ] JWT payload **aniq** [RBAC.md](https://github.com/javlonbek16/foodexpress-docs/blob/main/RBAC.md) dagidek: `sub`, `role`, `permissions[]`, `iat`, `exp`, `iss`.
- [ ] Parollar hech qachon ochiq saqlanmaydi/log qilinmaydi.
- [ ] CORS yoqilgan (frontend to'g'ridan murojaat qiladi, Gateway yo'q).
- [ ] Swagger: `http://localhost:3001/docs`.
- [ ] Validatsiya (class-validator), yagona xatolik formati ([ARCHITECTURE.md](https://github.com/javlonbek16/foodexpress-docs/blob/main/ARCHITECTURE.md)).

## 3. Ma'lumotlar modeli (`auth_db`)

**users**
| Maydon | Tur | Izoh |
|---|---|---|
| id | UUID (PK) | |
| email | varchar, unique | |
| password_hash | varchar | bcrypt/argon2 |
| role_id | UUID (FK → roles) | |
| is_active | boolean | |
| created_at / updated_at | timestamptz | |

**roles** — `id`, `name` (CUSTOMER/RESTAURANT/COURIER/ADMIN)
**permissions** — `id`, `code` (order.create, ...)
**role_permissions** — `role_id`, `permission_id` (many-to-many)
**refresh_tokens** — `id`, `user_id`, `token_hash`, `expires_at`, `revoked`

## 4. Asosiy endpointlar

| Method | Path | Permission | Tavsif |
|---|---|---|---|
| POST | `/auth/register` | — | Ro'yxatdan o'tish |
| POST | `/auth/login` | — | Login → tokenlar |
| POST | `/auth/refresh` | — | Access tokenni yangilash |
| POST | `/auth/logout` | auth | Refresh bekor qilish |
| GET | `/auth/me` | auth | Profil |
| GET | `/users` | `user.manage` | Foydalanuvchilar |
| PATCH | `/users/{id}/role` | `role.manage` | Rol o'zgartirish |

## 5. Acceptance criteria

- ✅ Register qilingan user login qila oladi va ikki token oladi.
- ✅ Access token ichida to'g'ri `role` va `permissions[]` bor (boshqa servis tekshira oladi).
- ✅ Refresh token bilan yangi access olinadi; logoutdan keyin u ishlamaydi.
- ✅ Noto'g'ri parol → `401`, ruxsatsiz endpoint → `403`.
- ✅ Swagger to'liq va RBAC.md ga mos.
- ✅ Boshqa servis bu JWT'ni `JWT_SECRET` bilan mustaqil tekshira oladi.

## 6. Arxitektura chegaralari
- ❌ API Gateway yo'q — CORS bilan to'g'ridan murojaat.
- ❌ Boshqa servis bazasiga tegmaysiz.
- ✅ DevOps/deploy — hozircha yo'q, faqat lokal.

## 7. O'rganish maqsadi
JWT access/refresh oqimi, parol xavfsizligi, RBAC modeli (rol↔permission), token-based stateless avtorizatsiya.
