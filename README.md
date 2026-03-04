# Legal Intermedia - Acreditación Náutica Inteligente

Este repositorio contiene el código fuente completo (Frontend + Backend) para la plataforma de Legal Intermedia. El proyecto incluye una pasarela de pagos con Stripe y conexión a base de datos en MongoDB.

## Requisitos Previos
Para levantar este proyecto en tu máquina local (entorno de desarrollo), necesitas:
- [Node.js](https://nodejs.org/) instalado.
- Acceso al panel de **Stripe** (entorno de pruebas/test).
- Acceso al clúster de **MongoDB Atlas**.
- Acceso a **Render** (donde está subida la web pública).
*(Solicita invitación a estas plataformas al administrador del proyecto).*

## Instalación y Configuración Local

1. **Clonar el repositorio:**

   git clone [https://github.com/Regaderaa/legal-intermedia-web.git](https://github.com/Regaderaa/legal-intermedia-web.git)
   cd legal-intermedia-web

2. **Instalar dependencias del servidor:**

    npm install

3. **Variables de Entorno (.env):**

    Crea un archivo llamado .env en la raíz del proyecto (pide el archivo original por privado al administrador).


4. **Arrancar el servidor en local:**

    Para que la integración con Stripe y MongoDB funcione en local, debes arrancar el servidor Node:

    node server.js


5. **Estructura de la Base de Datos (Modelo de Datos)**

La colección principal en MongoDB almacena los pedidos de los clientes. Cada documento tiene aproximadamente esta estructura:

nombre (String) - Nombre del titular.

email (String) - Correo de contacto.

telefono (String) - Teléfono móvil.

direccion (String) - Dirección completa de envío.

documento (String) - Archivo del título náutico adjunto.

stripeId (String) - Identificador único de la transacción en Stripe para cruzar datos.




