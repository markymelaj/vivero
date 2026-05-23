# Paesaggio Web + Control Comercial

Repo Next.js preparado para desplegar en Vercel con una capa privada de control comercial conectada a Supabase.

Incluye:

- Web pública de Paesaggio.
- Catálogo minorista.
- Página mayorista.
- Página de aliados.
- Panel privado `/admin`.
- Portal privado para aliados `/portal/[token]`.
- Gestión de productos y stock.
- Gestión de aliados: pet shops, corralones, viveros, arquitectos, paisajistas, comercios y vendedores.
- Consignaciones con trazabilidad.
- Registro de ventas de productos consignados.
- Cálculo automático de:
  - total vendido,
  - monto a rendir a Paesaggio,
  - comisión local,
  - stock restante.
- Registro de pagos/rendiciones.
- Generación de comisiones de vendedores sobre rendiciones confirmadas.
- Auditoría básica de movimientos.

## 1. Migración Supabase

Abrir Supabase → SQL Editor → pegar y ejecutar:

`supabase/migrations/20260523_pa_control_comercial.sql`

La migración es aditiva: usa prefijo `pa_` para no romper tablas existentes.

## 2. Variables de entorno para Vercel

Crear estas variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
APP_SESSION_SECRET=una_clave_larga_aleatoria_de_32_caracteres_o_mas
NEXT_PUBLIC_SITE_URL=https://tu-dominio-o-vercel.app
```

No publiques `SUPABASE_SERVICE_ROLE_KEY`. Solo debe existir como variable server-side en Vercel.

## 3. Usuario admin inicial

La migración crea este usuario:

```txt
Email: admin@paesaggio.local
Contraseña: Paesaggio2026!
```

Entrar en:

`/admin/login`

Recomendación: cambiar esa contraseña apenas se instale. Para generar un nuevo hash:

```bash
node scripts/hash-password.mjs 'NuevaClaveSegura'
```

Luego actualizar en Supabase:

```sql
update public.pa_app_users
set password_hash = 'PEGAR_HASH_GENERADO'
where email = 'admin@paesaggio.local';
```

## 4. Deploy en Vercel

```bash
npm install
npm run build
```

En Vercel:

- Framework: Next.js
- Build command: `npm run build`
- Output: automático
- Variables: las indicadas arriba

## 5. Uso operativo

### Crear aliado

Ir a `/admin/aliados` y cargar pet shop, corralón, vivero u otro comercio.

El sistema crea un link de portal privado para ese aliado:

`/portal/[token]`

Ese link permite que el aliado registre ventas sin acceder al admin.

### Crear consignación

Ir a `/admin/consignaciones/nueva`.

Elegir aliado, productos, cantidades, precio sugerido y valor a rendir.

Ejemplo:

- Producto: Sustrato 10 dm³
- Cantidad: 10
- Precio venta sugerido: 4000
- Valor a rendir a Paesaggio: 3000
- Comisión local: 1000 por unidad vendida

### Registrar venta

Desde admin o desde portal aliado.

El sistema calcula automáticamente:

- unidades vendidas,
- stock restante,
- total vendido,
- monto a rendir,
- comisión local.

### Registrar rendición

Desde la ficha de la consignación.

Cuando Paesaggio recibe plata, se carga el pago/rendición. Si hay vendedor asociado con porcentaje de comisión, el sistema genera comisión pendiente.

## 6. Seguridad

El panel no expone la service role al navegador. Todo acceso a Supabase pasa por código server-side.

Las tablas tienen RLS activado y sin policies públicas. La app trabaja desde el servidor usando `SUPABASE_SERVICE_ROLE_KEY`.

## 7. Archivos importantes

- `supabase/migrations/20260523_pa_control_comercial.sql`
- `lib/backoffice/supabase-rest.ts`
- `lib/backoffice/auth.ts`
- `lib/backoffice/actions.ts`
- `app/admin/*`
- `app/portal/[token]/*`
- `docs/SISTEMA_CONSIGNACION_TRAZABILIDAD.md`
