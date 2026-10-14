# Clínicas

Sistema de gestión de consultas clínicas — Programación Comercial (UMES).

- `backend/` — API REST NestJS + TypeORM + MySQL, arquitectura en capas.
- `frontend/` — Next.js (plantilla Dashcode), login contra el backend.
- `schema.dbml` — modelo de datos (se abre en https://dbdiagram.io).
- `AGENTS.md` / `CLAUDE.md` — instrucciones para Claude Code, Codex u OpenCode.

Cubre: historial médico, recetas, citas, alertas de pacientes crónicos, pacientes fallecidos y prioritarios, banco de productos de farmacia / muestras médicas, y login con token que vence cada 30 minutos. Toda acción queda en `audit_logs` con el usuario que la hizo.

## Requisitos

Node 20+ y MySQL 8 (o MariaDB 10.6+).

## Levantar el backend

```bash
cd backend
cp .env.example .env          # completar usuario/contraseña de MySQL y JWT_SECRET
npm install
npm run db:sql                # schema.dbml → database/schema.sql
npm run db:create -- --confirm  # crea las tablas (solo si la base está vacía)
npm run seed                  # catálogos + usuario admin
npm run start:dev             # http://localhost:3001/api
```

Usuario inicial: `admin@clinicas.local` / `Admin1234` (cámbialo).

## Levantar el frontend

```bash
cd frontend
cp .env.example .env.local    # poner en AUTH_SECRET el resultado de: openssl rand -base64 32
npm install
npm run dev                   # http://localhost:3000
```

## Endpoints principales

Todos bajo `/api` y con `Authorization: Bearer <token>` salvo el login.

| Método | Ruta | Uso |
|---|---|---|
| POST | `/auth/login` | Devuelve `accessToken` (30 min) |
| GET | `/patients?isPriority=true` · `?isDeceased=true` | Prioritarios / fallecidos |
| PATCH | `/patients/:id/priority` · `/patients/:id/deceased` | Marcar prioridad / fallecimiento |
| GET/POST | `/medical-history` | Historial médico |
| GET/POST | `/chronic-conditions` | Crea además la alerta de seguimiento |
| GET · PATCH | `/alerts` · `/alerts/:id/resolve` | Alertas de crónicos |
| GET/POST · PATCH | `/appointments` · `/appointments/:id/status` | Citas |
| GET/POST · PATCH | `/pharmacy-products` · `/pharmacy-products/:id/stock` | Farmacia y muestras |
| GET/POST | `/prescriptions` | Recetas con sus ítems |
| GET | `/audit-logs?entityName=patients&entityId=1` | Quién hizo qué (admin) |

## Prompt de inicio para el agente

> Este proyecto se llama "clinicas". Lee el CLAUDE.md y el AGENTS.md. Revisa schema.dbml y propón los cambios que necesite el modelo; puedes editarlo libremente, pero no crees ni modifiques la base de datos MySQL sin que yo lo autorice en el chat. Luego continúa con el backend en `backend/`. El frontend aún no lo toques.
