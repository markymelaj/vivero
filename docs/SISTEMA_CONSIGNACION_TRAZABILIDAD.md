# Paesaggio · Sistema de consignación y trazabilidad

## Objetivo
Controlar desde la web todo el circuito comercial:

1. Se crea un aliado: pet shop, corralón, vivero, arquitecto, paisajista o vendedor.
2. Se entrega mercadería en consignación.
3. El aliado registra ventas desde su portal o Paesaggio las registra desde admin.
4. El sistema calcula automáticamente:
   - total vendido,
   - monto que debe rendir a Paesaggio,
   - comisión que le queda al local,
   - stock restante.
5. Paesaggio registra la rendición/pago.
6. Si hay vendedor asociado, se genera comisión pendiente.
7. Todo movimiento queda trazado.

## Flujo de consignación

### 1. Alta de aliado
Ruta: `/admin/aliados`

Campos principales:
- tipo de aliado,
- nombre comercial,
- responsable,
- WhatsApp,
- zona,
- acuerdo,
- vendedor asociado.

Cada aliado recibe un `portal_token` y un link privado:

`/portal/<token>`

Ese portal sirve para que el pet shop o comercio registre ventas sin entrar al panel administrador.

### 2. Crear consignación
Ruta: `/admin/consignaciones/nueva`

Se elige:
- aliado,
- vendedor asociado,
- fecha de revisión/rendición,
- productos,
- cantidades,
- precio de venta sugerido,
- valor a rendir por unidad.

La comisión del local se calcula por unidad:

`comisión local = precio venta sugerido - valor a rendir`

### 3. Registrar venta
Ruta admin: `/admin/consignaciones/[id]`  
Ruta aliado: `/portal/[token]`

Al cargar una venta:
- suma `quantity_sold`,
- descuenta stock restante,
- calcula `total_sold`,
- calcula `total_to_render`,
- calcula `local_commission_total`.

### 4. Registrar rendición
Ruta: `/admin/consignaciones/[id]`

Al registrar pago/rendición:
- se suma a pagos confirmados,
- baja el saldo pendiente,
- cambia estado a `rendicion_parcial` o `rendida`,
- genera comisión del vendedor si corresponde.

### 5. Ajustes
Ruta: `/admin/consignaciones/[id]`

Permite registrar:
- devolución,
- producto dañado,
- faltante.

Cada ajuste queda en `pa_inventory_movements`.

## Estados principales

### Consignación
- preparando
- entregada
- recibida
- en_venta
- rendicion_parcial
- rendida
- observada
- cerrada

### Pago
- pendiente
- comprobante_recibido
- confirmado
- observado
- rechazado
- conciliado

### Comisión
- pendiente
- aprobada
- pagada
- anulada

## Tablas principales

- `pa_app_users`
- `pa_products`
- `pa_partners`
- `pa_consignments`
- `pa_consignment_items`
- `pa_consignment_sales`
- `pa_consignment_sale_items`
- `pa_payments`
- `pa_commissions`
- `pa_inventory_movements`
- `pa_audit_events`

## Vistas de cálculo

- `pa_v_consignment_items_status`
- `pa_v_consignments_summary`

## Funciones SQL

- `pa_create_consignment`
- `pa_register_consignment_sale`
- `pa_register_consignment_payment`
- `pa_register_consignment_adjustment`
- `pa_register_stock_adjustment`

## Regla operativa recomendada

No se repone a un aliado si no hay revisión de stock y rendición previa.

Toda reposición debe partir desde una nueva consignación para no mezclar ciclos.
