# PAESAGGIO · Sistema comercial remoto

## Objetivo

Que Paesaggio pueda vender aunque el dueño no esté en Argentina, separando claramente venta, cobro, preparación, entrega, comisiones y consignación.

La regla principal es simple: **toda operación debe quedar registrada antes de mover mercadería o pagar comisiones**.

---

## Roles

### Dirección / administración remota
- Define precios minoristas, mayoristas y condiciones.
- Atiende o supervisa WhatsApp Business.
- Controla pagos, comisiones y reportes.
- Decide altas de vendedores, comercios y aliados.

### Encargado local en Mendoza
- Confirma stock físico.
- Prepara pedidos.
- Saca foto del pedido preparado.
- Coordina con delivery o retiro.
- Revisa consignaciones.
- Informa faltantes y productos dañados.

### Vendedor externo
- Consigue clientes.
- Comparte catálogo o link.
- Envía consultas con su código.
- No debe prometer stock ni precio final sin confirmación.
- Cobra comisión solo por venta pagada y entregada.

### Comercio aliado
- Compra mayorista o trabaja consignación controlada.
- Recibe mercadería registrada.
- Rinde ventas según revisión semanal.

### Arquitecto / paisajista
- Puede pedir cotización por proyecto.
- Puede derivar clientes con código.
- Puede recibir comisión o beneficio comercial según acuerdo.

---

## Flujo de pedido online

1. Cliente consulta por WhatsApp, Instagram, web o vendedor.
2. Se registra el pedido en la hoja `Pedidos`.
3. Encargado local confirma stock.
4. Se informa precio final y envío.
5. Cliente paga o reserva.
6. Pago se registra en `Pagos`.
7. Encargado local prepara pedido y envía foto.
8. Se coordina retiro o delivery en `Entregas`.
9. Al entregar, se actualiza estado.
10. Si corresponde, se calcula comisión en `Comisiones`.

---

## Regla de cobro

Preferencia: **el cliente paga directo a Paesaggio**.

Los vendedores no deberían manejar dinero salvo autorización puntual. El vendedor genera la venta y el código de origen; administración registra pago y comisión.

Estados recomendados:
- Pendiente
- Pagado
- Parcial
- Cancelado
- Reintegrado

---

## Regla de comisión

La comisión se paga solo cuando la venta está:

1. Registrada.
2. Pagada.
3. Entregada.
4. Asociada a un código de vendedor o aliado.

No se paga comisión por consulta, promesa, pedido cancelado o venta no cobrada.

Comisiones iniciales sugeridas:
- Venta minorista: 8% a 12%.
- Venta mayorista: 3% a 6%.
- Proyecto / arquitectura: 5% a 10%.

En la planilla se dejan porcentajes editables por vendedor.

---

## Consignación

Al inicio, consignar solo productos menos riesgosos:

- Tierra preparada.
- Sustratos.
- Humus.
- Chips.
- Cortezas.

No conviene dejar plantas delicadas en consignación hasta tener control operativo real.

Cada entrega en consignación debe registrar:
- Local.
- Responsable.
- Producto.
- Cantidad entregada.
- Precio sugerido.
- Valor a rendir.
- Fecha de revisión.
- Foto de góndola o stock.

---

## Códigos de origen

Usar códigos para saber quién generó cada venta.

Ejemplos:
- `WEB`: venta digital directa.
- `ADM`: venta administrada directa.
- `VEN01`: vendedor externo.
- `ARQ01`: arquitecto o paisajista.
- `VIV01`: vivero.
- `COR01`: corralón.
- `PET01`: pet shop.

---

## WhatsApp Business

Etiquetas recomendadas:
- Nuevo cliente
- Minorista
- Mayorista
- Viverista
- Arquitecto / paisajista
- Comercio aliado
- Pedido en curso
- Pendiente de pago
- Preparar pedido
- En entrega
- Entregado
- Consignación
- Comisión pendiente

---

## Rutina semanal

### Todos los días
- Revisar consultas.
- Confirmar stock antes de cotizar final.
- Registrar pagos.
- Actualizar entregas.

### Dos veces por semana
- Publicar disponibilidad.
- Contactar viveristas, arquitectos y comercios.
- Revisar pedidos pendientes.

### Una vez por semana
- Liquidar comisiones.
- Revisar consignaciones.
- Ver productos más vendidos.
- Detectar faltantes y productos a reponer.

---

## Prioridad de crecimiento

1. Venta online minorista para caja diaria.
2. Viveristas y mayoristas para volumen.
3. Comercios aliados con sustratos, tierra, chips y cortezas.
4. Arquitectos y paisajistas para proyectos de mayor ticket.
5. Vendedores externos cuando ya exista control real.
