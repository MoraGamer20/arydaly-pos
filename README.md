# VentaPro POS — Sistema Web de Punto de Venta y Gestión Comercial

> **VentaPro POS** es un sistema integral y funcional de punto de venta (POS) para navegador web, diseñado para pequeños y medianos comercios (tiendas de abarrotes, farmacias, ferreterías, papelerías y minimarkets). Permite operar de forma rápida en mostrador, registrar ventas, cobrar con múltiples métodos de pago, controlar inventario, administrar caja, compras a proveedores, clientes y generar reportes financieros con márgenes de ganancia en tiempo real.

Listo para ser publicado en **GitHub** y desplegado en **Vercel**, con soporte para base de datos relacional **Supabase (PostgreSQL + RLS)** y modo local offline-first continuo.

---

## 📋 Módulos del Sistema

1. **Terminal Punto de Venta (POS / Mostrador)**:
   - Entrada rápida por código de barras o búsqueda en tiempo real por nombre/SKU.
   - Atajos de teclado para cajeros: `[F1]` Venta nueva, `[F2]` Dashboard, `[F3]` Productos, `[F4]` Caja, `[F12]` Cobrar venta.
   - Teclado numérico táctil en pantalla para pantallas touch o all-in-one.
   - Asignación rápida de clientes a la venta.
   - Métodos de pago: Efectivo (con cálculo automático de cambio), Tarjeta de débito/crédito, Transferencia bancaria y Mixto.
   - Emisión e impresión de tickets térmicos (58mm y 80mm) con desglose de IVA, código de barras y leyenda fiscal.

2. **Panel de Control (Dashboard)**:
   - Métricas en vivo del día: Total vendido, Ganancia bruta estimada, Número de tickets cobrados, Ticket promedio.
   - Estado en vivo de la caja registradora.
   - Alertas inmediatas de productos con stock crítico o agotado.
   - Feed de últimas ventas realizadas con reimpresión de comprobante con un clic.
   - Atajos directos a operaciones frecuentes.

3. **Catálogo de Productos y Categorías**:
   - Altas, bajas y modificaciones completas de productos.
   - Campos: SKU, Código de barras, Nombre, Categoría, Precio de costo, Precio de venta, Margen de ganancia calculado, Stock actual, Stock mínimo y Unidad de medida.
   - Filtros por categoría y buscador instantáneo.
   - Indicadores visuales de existencia suficiente, baja o agotada.

4. **Control de Inventario y Kardex**:
   - Valuación monetaria del inventario: Costo total valorizado, Valor proyectado a la venta y Utilidad latente.
   - Ajuste rápido de existencias con justificación de motivo (Entrada por ajuste, Salida por merma, Daño, etc.).
   - Historial de movimientos (Kardex de auditoría) con usuario responsable, fecha y cantidad previa/posterior.

5. **Control de Caja y Turnos (Arqueo)**:
   - Apertura de turno con monto inicial de fondo de caja.
   - Registro de entradas (depósitos o cobros extra) y salidas de efectivo (pagos de servicios, retiros para proveedores).
   - Arqueo de caja y corte ciego/cierre con cálculo automático de sobrante o faltante.
   - Historial de sesiones y desglose por cajero.

6. **Historial de Ventas**:
   - Registro de todas las transacciones realizadas con folio consecutivo.
   - Detalle de artículos vendidos, método de pago, cajero y cliente.
   - Cancelación de ventas con reposición automática al inventario.
   - Reimpresión de tickets en cualquier momento.

7. **Gestión de Compras y Proveedores**:
   - Directorio de proveedores con RFC, teléfono, correo y contacto.
   - Registro de compras de mercancía a proveedores con número de factura, renglones de productos y actualización automática del stock y precio de costo.

8. **Cartera de Clientes**:
   - Directorio con datos fiscales (RFC, dirección, teléfono, correo).
   - Saldo de crédito y límites para cuentas por cobrar.
   - Historial de compras por cliente.

9. **Reportes Financieros y Ganancias**:
   - Resumen financiero: Ventas brutas, Costo de mercancía vendida (COGS) y Utilidad neta real.
   - Ventas desglosadas por método de pago (Efectivo, Tarjeta, Transferencia).
   - Ranking de productos más vendidos por volumen e ingresos generados.
   - Margen de ganancia porcentual del negocio.

10. **Usuarios, Cajeros y Seguridad**:
    - Control de accesos con 3 niveles: **Administrador**, **Encargado** y **Cajero**.
    - Código PIN de 4 dígitos para cambio rápido de turno en terminal.
    - Cambio de usuario activo sin recargar la aplicación.

11. **Configuración del Negocio**:
    - Nombre del comercio, RFC, teléfono, dirección y correo.
    - Símbolo de moneda (`$`) y código (`MXN`, `USD`, `EUR`, etc.).
    - Tasa de impuesto / IVA configurable (ej. 16%).
    - Encabezado y pie de página personalizados para el ticket de venta.
    - Exportación de respaldo completo en formato JSON y restablecimiento de datos de demostración.

---

## 🛠 Tecnologías Utilizadas

- **React 19 + TypeScript**: Arquitectura por componentes con tipado estático riguroso.
- **Tailwind CSS v4**: Interfaz limpia, accesible (WCAG AA) y optimizada para uso intensivo en mostrador.
- **Lucide React**: Iconografía moderna y consistente.
- **Vite 8**: Compilación ultrarrápida y empaquetado para producción.
- **Supabase / PostgreSQL**: Esquema relacional con Row Level Security incluido en `supabase-schema.sql`.

---

## 🗄️ Esquema de Base de Datos Supabase (PostgreSQL)

El proyecto incluye el archivo `supabase-schema.sql` con la estructura de tablas relacionales:
- `users`: Cajeros y administradores con roles y PIN.
- `categories`: Clasificación de productos.
- `products`: Catálogo con SKU, código de barras, precios y existencias.
- `customers`: Directorio y créditos de clientes.
- `suppliers`: Directorio de distribuidores.
- `sales` y `sale_items`: Transacciones, subtotales, IVA y métodos de pago.
- `purchases` y `purchase_items`: Reabastecimiento a proveedores.
- `inventory_movements`: Kardex de auditoría de entradas y salidas.
- `cash_registers` y `cash_movements`: Cortes de caja y arqueos.
- `business_settings`: Datos del comercio y parámetros fiscales.
- Políticas RLS (Row Level Security) configuradas para seguridad multi-tenant.

---

## 🚀 Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/ventapro-pos.git
   cd ventapro-pos
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   Visita `http://localhost:3000`.

---

## ☁️ Despliegue en GitHub y Vercel

### 1. Subir a GitHub
```bash
git init
git add .
git commit -m "feat: Sistema de Punto de Venta VentaPro POS completo"
git branch -M main
git remote add origin https://github.com/tu-usuario/ventapro-pos.git
git push -u origin main
```

### 2. Desplegar en Vercel
1. Ingresa a [vercel.com](https://vercel.com) e inicia sesión.
2. Haz clic en **"Add New..."** > **"Project"**.
3. Importa el repositorio `ventapro-pos`.
4. Vercel detectará el preset **Vite**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Haz clic en **"Deploy"**. En segundos tu punto de venta estará listo en la nube con HTTPS gratuito y certificado SSL.

---

## ⌨️ Atajos de Teclado del Mostrador

| Tecla | Acción |
| :--- | :--- |
| **`[F1]`** | Ir al Punto de Venta / Terminal de Cobro |
| **`[F2]`** | Ir al Panel de Control (Dashboard) |
| **`[F3]`** | Ir al Catálogo de Productos |
| **`[F4]`** | Ir al Control de Caja / Arqueo |
| **`[Enter]`** | Agregar producto escaneado / Confirmar cobro en modal |
| **`[Esc]`** | Cerrar ventanas modales activas |

---

## 📄 Licencia

Este proyecto está disponible bajo la licencia **MIT**.
