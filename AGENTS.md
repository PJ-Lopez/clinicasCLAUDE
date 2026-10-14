# AGENTS.md

## Descripción general
Sistema de gestión hospitalaria compuesto por dos proyectos dentro de este repositorio:

- `frontend/` — Aplicación **Next.js** (ya existe una plantilla base, no se debe reestructurar sin indicación explícita).
- `backend/` — API REST en **NestJS** (ya creada; seguir el patrón existente al agregar módulos).

## Stack tecnológico

### Backend
- **NestJS** (framework)
- **TypeORM** (ORM)
- **MySQL** (base de datos)
- **Passport + JWT** (autenticación — token con expiración de **30 minutos**)
- **class-validator / class-transformer** (DTOs de entrada/salida)

### Frontend
- **Next.js 14** (plantilla Dashcode en `frontend/`)
- **NextAuth v5** (login con credenciales contra el backend; sesión de 30 min ligada al JWT del backend)

## Arquitectura del backend

Arquitectura **en capas**, con **un módulo por dominio**. La regla más importante: la lógica de negocio de cada entidad vive en su propio servicio, nunca en un repositorio genérico compartido.

Capas (de arriba hacia abajo):

1. **Controller** — recibe la petición HTTP, valida el DTO de entrada, delega al Service. No contiene lógica de negocio.
2. **Service** — lógica de negocio específica de cada dominio (ej. `PatientsService.markAsDeceased()`, `ChronicConditionsService.evaluateAlerts()`). La regla de negocio vive aquí, **no** en el repositorio.
3. **Repository** — acceso a datos vía TypeORM. Cada entidad tiene su propio repositorio. Puede extender una clase base ligera con operaciones simples y genéricas (`findById`, `save`, `softDelete`), pero **la lógica de dominio nunca se condensa en un repositorio genérico único**.
4. **Entity** — definición de la tabla vía decoradores de TypeORM.

> Regla explícita del proyecto: **no** crear un `CRUDRepository` que centralice el CRUD de todas las entidades. Cada modelo tiene su propio servicio con su propia lógica.

## Estructura de carpetas propuesta (backend)

```
backend/
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/            # filtro global de excepciones
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── base/
│   │       └── base.repository.ts   # métodos genéricos simples (SIN lógica de negocio)
│   ├── config/
│   │   ├── database.config.ts
│   │   └── env.validation.ts
│   ├── modules/
│   │   ├── audit/              # AuditService + GET /audit-logs (solo lectura, admin)
│   │   ├── catalogs/           # roles, estados y tipos (solo lectura)
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/jwt.strategy.ts
│   │   │   ├── guards/jwt-auth.guard.ts
│   │   │   ├── guards/roles.guard.ts
│   │   │   └── dto/login.dto.ts
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── entities/user.entity.ts
│   │   │   └── dto/
│   │   ├── patients/
│   │   │   ├── patients.module.ts
│   │   │   ├── patients.controller.ts
│   │   │   ├── patients.service.ts   # markAsDeceased(), markAsPriority(), etc.
│   │   │   ├── patients.repository.ts
│   │   │   ├── entities/patient.entity.ts
│   │   │   └── dto/
│   │   ├── medical-history/
│   │   ├── chronic-conditions/
│   │   ├── alerts/
│   │   ├── appointments/
│   │   ├── prescriptions/
│   │   └── pharmacy-products/
│   ├── app.module.ts
│   └── main.ts
├── scripts/
│   ├── dbml-to-sql.js      # schema.dbml → database/schema.sql (no toca la BD)
│   └── db-create.js        # aplica schema.sql; exige --confirm
├── database/schema.sql     # generado, no editar a mano
├── .env.example
├── package.json
└── tsconfig.json
```

## Normalización (catálogos en lugar de ENUM)

Los valores que antes eran `ENUM` en el modelo (`role`, `status` de citas, `status` de alertas, `type` de producto) están normalizados en tablas de catálogo propias, referenciadas por FK:

| Antiguo ENUM | Tabla de catálogo | Usado por |
|---|---|---|
| `user_role` | `roles` | `users.role_id` |
| `appointment_status` | `appointment_statuses` | `appointments.status_id` |
| `alert_status` | `alert_statuses` | `alerts.status_id` |
| `product_type` | `product_types` | `pharmacy_products.type_id` |

Razón: permite agregar/editar valores sin migraciones de esquema, mantiene integridad referencial real y facilita traducciones o metadatos adicionales por catálogo (`description`, etc.). Estas tablas se siembran (`seed`) al desplegar el backend; no se exponen para creación libre desde la API (solo lectura para poblar selects del frontend).

## Auditoría

Dos mecanismos complementarios, ambos obligatorios en todo módulo que cree/modifique/elimine datos de negocio:

1. **`created_by_id` / `updated_by_id`** (y `resolved_by_id` en `alerts`) en cada entidad de negocio — referencia directa al usuario autenticado que originó la última escritura, sin necesidad de consultar la bitácora para saber "quién lo hizo por última vez".
2. **`audit_logs`** — bitácora genérica e inmutable de toda acción relevante: `user_id`, `action` (`CREATE` | `UPDATE` | `DELETE` | `LOGIN` | `LOGIN_FAILED`), `entity_name`, `entity_id`, `old_values` / `new_values` (JSON), `ip_address`, `created_at`. Esta tabla nunca se actualiza ni se borra, solo se inserta.

Implementación recomendada en NestJS: un `AuditInterceptor` global (o un `AuditService` inyectado en cada servicio) que, tras cada operación exitosa de escritura, inserta el registro correspondiente en `audit_logs` tomando el usuario del `request` (inyectado por el `JwtAuthGuard`). Los servicios de dominio (`PatientsService`, `AppointmentsService`, etc.) son responsables de poblar `created_by_id` / `updated_by_id` al momento de guardar.

## Autorización de agentes sobre el modelo de datos

- Los agentes (Claude Code u otros) **tienen autorización para modificar `schema.dbml`** libremente como parte de la evolución del proyecto: agregar/quitar columnas, tablas, catálogos o relaciones, siempre documentando el cambio en el propio commit.
- **Generar o ejecutar el script de creación de la base de datos en MySQL** (migraciones, `CREATE TABLE`, `synchronize: true` en producción, o cualquier comando que impacte una base de datos real) **requiere autorización explícita del usuario en la conversación** antes de ejecutarse. Modificar el archivo `schema.dbml` no implica esa autorización.
- Una vez autorizado explícitamente, el script de base de datos debe generarse **a partir del `schema.dbml` vigente**, para que ambos artefactos nunca queden desincronizados.

### Flujo para crear la BD desde `schema.dbml`

```bash
cd backend
npm run db:sql                    # libre: valida schema.dbml y genera database/schema.sql
npm run db:create -- --confirm    # SOLO con autorización del usuario en el chat
npm run seed                      # catálogos + usuario admin inicial
```

- `db:create` sin `--confirm` no hace nada, y se niega a correr si la base ya tiene tablas (no pisa datos).
- Si `schema.dbml` tiene errores de sintaxis, `db:sql` falla e indica la línea: corregir el `.dbml`, no el SQL.
- Tras cambiar `schema.dbml`, actualizar también las entidades de TypeORM correspondientes.

## Módulos de dominio (mínimo requerido)

| Módulo | Responsabilidad |
|---|---|
| `auth` | Login, generación y validación de JWT (expiración 30 min) |
| `users` | Usuarios del sistema y roles |
| `patients` | Pacientes, incluye flags `isPriority` e `isDeceased` |
| `medical-history` | Historial médico por paciente |
| `chronic-conditions` | Condiciones crónicas por paciente, dispara alertas |
| `alerts` | Alertas activas/resueltas para pacientes crónicos |
| `appointments` | Registro de citas |
| `prescriptions` | Recetas y su detalle (`prescription-items`) |
| `pharmacy-products` | Banco de productos de farmacia / muestras médicas |
| `catalogs` | Lectura de roles, estados de cita/alerta y tipos de producto |
| `audit` | Registro y consulta de `audit_logs` (solo admin) |

## Reglas de negocio implementadas

- Registrar una condición crónica activa crea automáticamente una alerta `chronic_follow_up`.
- Un paciente fallecido **no** puede recibir citas nuevas ni recetas, y no puede marcarse como prioritario. Al marcarlo fallecido se fija `deceased_at` una sola vez y pierde la prioridad.
- `GET /patients?isPriority=true` y `GET /patients?isDeceased=true` listan prioritarios y fallecidos; por defecto los prioritarios salen primero.
- `GET /audit-logs?entityName=patients&entityId=1` responde quién hizo cada acción sobre un registro (también filtra por `userId` y `action`).

## Autenticación

- JWT firmado con `JWT_SECRET`, `expiresIn: '30m'`.
- `JwtAuthGuard` + `RolesGuard` (roles: `admin`, `doctor`, `nurse`, `receptionist`, `pharmacist`) para proteger rutas.
- No se implementa refresh token en esta primera fase; al vencer el token el usuario debe autenticarse de nuevo.
- En el frontend, la sesión de NextAuth guarda el `accessToken` del backend y lee su `exp`: al vencer, la sesión se anula y el middleware redirige al login.

## Variables de entorno (`.env`)

```
DB_HOST=
DB_PORT=3306
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
JWT_SECRET=
JWT_EXPIRES_IN=30m
PORT=3001
DB_SYNCHRONIZE=false   # nunca true fuera de desarrollo local
```

Frontend (`frontend/.env.local`, ver `frontend/.env.example`):

```
API_URL=http://localhost:3001/api
NEXT_PUBLIC_API_URL=http://localhost:3001/api
AUTH_SECRET=            # openssl rand -base64 32
```

## Convenciones de código

- DTOs con `class-validator` para toda entrada; nunca aceptar payloads sin validar.
- Nomenclatura: `snake_case` en columnas de BD, `camelCase` en TypeScript, `kebab-case` en carpetas/archivos.
- Respuestas HTTP consistentes vía filtro de excepciones global (`common/filters`).
- Ningún `ENUM` de MySQL: todo valor cerrado de negocio (roles, estados, tipos) va en tabla de catálogo con FK.
- Toda escritura (create/update/delete) en una entidad de negocio debe registrar `created_by_id`/`updated_by_id` y generar una entrada en `audit_logs`.
- **Sin pruebas unitarias en esta fase inicial** (solicitado explícitamente).

## Frontend

- La carpeta `frontend/` ya contiene la plantilla base de Next.js; no reestructurar salvo indicación explícita.
- Todo el proyecto está en **español** (un solo locale `es`, sin selector de idioma ni soporte RTL/árabe). No reintroducir otros idiomas.
- El consumo de la API del backend se centraliza en `frontend/lib/api-client.ts` (`apiFetch` + objetos por recurso, ej. `authApi`). Nunca `fetch` disperso en componentes.
- Autenticación: `frontend/lib/auth.ts` (NextAuth), `frontend/action/auth-action.ts` (login/logout) y `frontend/middleware.ts` (protege todas las rutas salvo el login).
- Menú lateral: `frontend/lib/menus.ts`. Solo opciones del dominio clínico.
- Las páginas demo de la plantilla (`charts`, `ecommerce`, `components`, etc.) siguen en el código como referencia visual, pero no están en el menú. Se pueden borrar cuando ya no se necesiten.
- Estado actual: login funcionando; **los CRUD aún no están integrados** en el frontend.

## Modelo de datos

Ver `schema.dbml` (importable en https://dbdiagram.io) para el diagrama entidad-relación propuesto.