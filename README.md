# Caja Diaria de Imprenta

Sistema web de **gestión de caja diaria** para un negocio de impresión. Registra ingresos y gastos por cliente, controla los saldos pendientes mediante abonos y ofrece un panel con el resumen del turno. Proyecto de portafolio desarrollado con **Next.js 16**, **React 19**, **Prisma 7** y **PostgreSQL**.

## Funcionalidades

- **Autenticación por negocio**: registro e inicio de sesión con sesiones seguras (bcrypt + cookie firmada). Cada negocio ve solo su propia información.
- **Panel de resumen**: métricas de ganancia neta, ingresos, gastos y saldo pendiente, con filtro por rango de fechas.
- **Movimientos**: registro de ingresos y gastos asociados a un cliente, con método de pago (efectivo, tarjeta, transferencia), observación y estados de cobro (pagado, parcial, pendiente).
- **Clientes**: registro, búsqueda y administración de clientes por negocio.
- **Cobros pendientes**: control de saldos abiertos, registro de abonos y filtros por antigüedad (hoy / antiguos).
- **Diseño**: interfaz clara con acentos de marca (índigo/azul), sidebar oscuro fintech y alertas con SweetAlert2.

## Stack

- **Frontend/Backend**: Next.js 16 (App Router, React Server Components, Server Actions)
- **ORM**: Prisma 7 con driver adapter para PostgreSQL
- **Base de datos**: PostgreSQL (Docker)
- **Estilos**: Tailwind CSS 4, iconos react-icons
- **Extras**: bcryptjs (hash de contraseñas), SweetAlert2, Moment (fechas)

