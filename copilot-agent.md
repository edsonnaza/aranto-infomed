#🧾 Contexto del proyecto: Migración Legacy → Nuevo Sistema

Estamos migrando datos de un sistema **legacy (MySQL)** a un **nuevo sistema Laravel 10 + MySQL**.  
Las entidades principales son:

### 1. Cash Registers
- **cash_register_openings**: cabecera de apertura de caja.
- **cash_register_movements**: ingresos (`income`) y egresos (`expense`) migrados desde:
  - `legacy.turnosdet` → `cash_register_movements` con `type=expense`
  - `legacy.turnosdetingresos` → `cash_register_movements` con `type=income`
- Reglas de migración:
  - Migrar solo registros con `estado=1`.
  - Vincular con `cash_register_openings.id = legacy.idturnoscab`.
  - Validar consistencia caja por caja (suma ingresos/egresos vs legacy).
  - Reportar cajas que cuadran y las que no cuadran.

### 2. Patient Visits & Orders
- **patient_visits**: cabecera de visita del paciente.
  - Tiene `professional_id`.
- **patient_visit_orders**: servicios/órdenes dentro de la visita.
  - Se decidió **agregar columna `professional_id`** para performance y trazabilidad.
  - Cada orden debe almacenar también:
    - `commission_percentage` (copiado en el momento de creación desde `professionals.commission_percentage`).
    - `commission_amount` (calculado como `total * commission_percentage / 100`).
  - Esto evita que un cambio futuro en la comisión del profesional afecte órdenes históricas.

### 3. Commission Payments
- **commission_payments** (cabecera):
  - `id`
  - `cash_register_opening_id` (referencia a caja donde se paga)
  - `professional_id`
  - `from_date` / `to_date`
  - `total_production` (sumatoria de órdenes)
  - `total_paid` (sumatoria de comisiones pagadas)
  - `created_at`, `updated_at`

- **commission_payment_details** (detalle):
  - `id`
  - `commission_payment_id` (FK → commission_payments)
  - `patient_visit_order_id` (FK → orden pagada)
  - `order_amount`
  - `commission_percentage`
  - `commission_amount`
  - `created_at`, `updated_at`

### 4. Reglas de negocio de comisiones
- Solo se pueden liquidar servicios **pagados por completo** (no se permiten comisiones sobre pagos parciales).
- El usuario en frontend selecciona **profesional + rango de fechas**.
- El sistema lista todas las órdenes no liquidadas (`patient_visit_orders` sin vínculo en `commission_payment_details`) y pagadas completamente.
- Una vez confirmado, se genera:
  - Cabecera en `commission_payments`.
  - Detalles en `commission_payment_details`.
  - Se marcan las órdenes como ya liquidadas.
- Nunca recalcular `commission_amount` retroactivamente: se guarda fijo al momento de registrar la orden.

---

# 🧩 Instrucciones para Copilot Agent

Cuando el usuario me pida ayuda en este contexto, debo:
1. Sugerir migraciones y seeders para mantener integridad de datos entre legacy y nuevo sistema.
2. Optimizar consultas y estructuras (ej: agregar `professional_id` a `patient_visit_orders`).
3. Generar validaciones de consistencia (cajas que cuadran vs legacy).
4. Implementar lógica de cálculo de comisiones:
   - Guardar `professional_id`, `commission_percentage` y `commission_amount` en cada orden.
   - Evitar recalcular retroactivamente.
   - Controlar que solo órdenes **fully paid** entren en liquidaciones.
5. Crear migraciones para `commission_payments` y `commission_payment_details`.
6. Sugerir reportes y verificaciones de diferencias (ingresos/egresos, comisiones pagadas vs pendientes).
7. Mantener código Laravel/PHP limpio, chunked para performance en migraciones grandes.

---

# ✅ Output esperado
- Código Laravel: migraciones, seeders, queries de validación, comandos artisan.
- Sugerencias de optimización de performance.
- Reportes claros de consistencia (ejemplo: cajas cuadradas vs no cuadradas, órdenes liquidadas vs pendientes).
- No recalcular retroactivamente comisiones.
- Siempre relacionar datos con `cash_register_openings` y `patient_visit_orders`.