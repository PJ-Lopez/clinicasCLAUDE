-- Generado automaticamente desde schema.dbml el 2026-10-14T02:35:53.237Z
-- NO editar a mano: modificar schema.dbml y correr "npm run db:sql".

CREATE TABLE `roles` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(50) UNIQUE NOT NULL,
  `description` varchar(255),
  `status` int NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now())
);

CREATE TABLE `appointment_statuses` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(50) UNIQUE NOT NULL,
  `description` varchar(255),
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now())
);

CREATE TABLE `alert_statuses` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(50) UNIQUE NOT NULL,
  `description` varchar(255),
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now())
);

CREATE TABLE `product_types` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(50) UNIQUE NOT NULL,
  `description` varchar(255),
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now())
);

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(150) UNIQUE NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_active` boolean NOT NULL DEFAULT true,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now())
);

CREATE TABLE `patients` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `birth_date` date NOT NULL,
  `gender` varchar(20),
  `national_id` varchar(30) UNIQUE,
  `phone` varchar(30),
  `address` varchar(255),
  `is_priority` boolean NOT NULL DEFAULT false,
  `is_deceased` boolean NOT NULL DEFAULT false,
  `deceased_at` datetime,
  `created_by_id` int NOT NULL,
  `updated_by_id` int,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now())
);

CREATE TABLE `medical_histories` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `visit_date` datetime NOT NULL,
  `diagnosis` text,
  `notes` text,
  `created_by_id` int NOT NULL,
  `updated_by_id` int,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now())
);

CREATE TABLE `chronic_conditions` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `condition_name` varchar(150) NOT NULL,
  `diagnosed_at` date,
  `severity` varchar(30),
  `is_active` boolean NOT NULL DEFAULT true,
  `created_by_id` int NOT NULL,
  `updated_by_id` int,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now())
);

CREATE TABLE `alerts` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `chronic_condition_id` int,
  `status_id` int NOT NULL,
  `alert_type` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `triggered_at` datetime NOT NULL DEFAULT (now()),
  `resolved_at` datetime,
  `resolved_by_id` int,
  `created_by_id` int NOT NULL,
  `updated_by_id` int,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now())
);

CREATE TABLE `appointments` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `status_id` int NOT NULL,
  `scheduled_at` datetime NOT NULL,
  `reason` varchar(255),
  `notes` text,
  `created_by_id` int NOT NULL,
  `updated_by_id` int,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now())
);

CREATE TABLE `pharmacy_products` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `type_id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `manufacturer` varchar(150),
  `stock_quantity` int NOT NULL DEFAULT 0,
  `unit` varchar(30),
  `expiration_date` date,
  `created_by_id` int NOT NULL,
  `updated_by_id` int,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now())
);

CREATE TABLE `prescriptions` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `medical_history_id` int,
  `issued_at` datetime NOT NULL DEFAULT (now()),
  `notes` text,
  `created_by_id` int NOT NULL,
  `updated_by_id` int,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now())
);

CREATE TABLE `prescription_items` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `prescription_id` int NOT NULL,
  `pharmacy_product_id` int NOT NULL,
  `dosage` varchar(100),
  `frequency` varchar(100),
  `duration` varchar(100),
  `quantity` int NOT NULL DEFAULT 1,
  `created_by_id` int NOT NULL,
  `updated_by_id` int,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now())
);

CREATE TABLE `audit_logs` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `action` varchar(20) NOT NULL,
  `entity_name` varchar(100) NOT NULL,
  `entity_id` int,
  `old_values` json,
  `new_values` json,
  `ip_address` varchar(45),
  `created_at` datetime NOT NULL DEFAULT (now())
);

ALTER TABLE `roles` COMMENT = 'Catalogo de roles: admin, doctor, nurse, receptionist, pharmacist';

ALTER TABLE `appointment_statuses` COMMENT = 'Catalogo: scheduled, completed, cancelled, no_show';

ALTER TABLE `alert_statuses` COMMENT = 'Catalogo: active, resolved';

ALTER TABLE `product_types` COMMENT = 'Catalogo: medicamento, muestra_medica';

ALTER TABLE `users` COMMENT = 'Usuarios del sistema: medicos, administradores, recepcion, farmacia';

ALTER TABLE `patients` COMMENT = 'Pacientes. is_priority e is_deceased cubren directamente esos dos requerimientos';

ALTER TABLE `medical_histories` COMMENT = 'Historial medico: cada fila es una consulta / evento clinico';

ALTER TABLE `chronic_conditions` COMMENT = 'Condiciones cronicas por paciente; disparan alertas de seguimiento';

ALTER TABLE `alerts` COMMENT = 'Alertas para pacientes cronicos (extensible a otros disparadores). status_id -> alert_statuses';

ALTER TABLE `appointments` COMMENT = 'Registro de citas medicas. status_id -> appointment_statuses';

ALTER TABLE `pharmacy_products` COMMENT = 'Banco de datos de productos de farmacia y muestras medicas. type_id -> product_types';

ALTER TABLE `prescriptions` COMMENT = 'Recetas medicas emitidas a un paciente';

ALTER TABLE `prescription_items` COMMENT = 'Detalle de medicamentos/muestras incluidos en una receta';

ALTER TABLE `audit_logs` COMMENT = 'Bitacora inmutable. action: CREATE|UPDATE|DELETE|LOGIN|LOGIN_FAILED. Nunca se actualiza ni borra.';

ALTER TABLE `users` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

ALTER TABLE `patients` ADD FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`);

ALTER TABLE `patients` ADD FOREIGN KEY (`updated_by_id`) REFERENCES `users` (`id`);

ALTER TABLE `medical_histories` ADD FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`);

ALTER TABLE `medical_histories` ADD FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`);

ALTER TABLE `medical_histories` ADD FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`);

ALTER TABLE `medical_histories` ADD FOREIGN KEY (`updated_by_id`) REFERENCES `users` (`id`);

ALTER TABLE `chronic_conditions` ADD FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`);

ALTER TABLE `chronic_conditions` ADD FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`);

ALTER TABLE `chronic_conditions` ADD FOREIGN KEY (`updated_by_id`) REFERENCES `users` (`id`);

ALTER TABLE `alerts` ADD FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`);

ALTER TABLE `alerts` ADD FOREIGN KEY (`chronic_condition_id`) REFERENCES `chronic_conditions` (`id`);

ALTER TABLE `alerts` ADD FOREIGN KEY (`status_id`) REFERENCES `alert_statuses` (`id`);

ALTER TABLE `alerts` ADD FOREIGN KEY (`resolved_by_id`) REFERENCES `users` (`id`);

ALTER TABLE `alerts` ADD FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`);

ALTER TABLE `alerts` ADD FOREIGN KEY (`updated_by_id`) REFERENCES `users` (`id`);

ALTER TABLE `appointments` ADD FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`);

ALTER TABLE `appointments` ADD FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`);

ALTER TABLE `appointments` ADD FOREIGN KEY (`status_id`) REFERENCES `appointment_statuses` (`id`);

ALTER TABLE `appointments` ADD FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`);

ALTER TABLE `appointments` ADD FOREIGN KEY (`updated_by_id`) REFERENCES `users` (`id`);

ALTER TABLE `pharmacy_products` ADD FOREIGN KEY (`type_id`) REFERENCES `product_types` (`id`);

ALTER TABLE `pharmacy_products` ADD FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`);

ALTER TABLE `pharmacy_products` ADD FOREIGN KEY (`updated_by_id`) REFERENCES `users` (`id`);

ALTER TABLE `prescriptions` ADD FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`);

ALTER TABLE `prescriptions` ADD FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`);

ALTER TABLE `prescriptions` ADD FOREIGN KEY (`medical_history_id`) REFERENCES `medical_histories` (`id`);

ALTER TABLE `prescriptions` ADD FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`);

ALTER TABLE `prescriptions` ADD FOREIGN KEY (`updated_by_id`) REFERENCES `users` (`id`);

ALTER TABLE `prescription_items` ADD FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`id`);

ALTER TABLE `prescription_items` ADD FOREIGN KEY (`pharmacy_product_id`) REFERENCES `pharmacy_products` (`id`);

ALTER TABLE `prescription_items` ADD FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`);

ALTER TABLE `prescription_items` ADD FOREIGN KEY (`updated_by_id`) REFERENCES `users` (`id`);

ALTER TABLE `audit_logs` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
