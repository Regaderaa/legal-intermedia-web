// ============================================================================
// ARCHIVO: server.js
// DESCRIPCIÓN: Este es el "cerebro" (backend) de nuestra página web.
// Se encarga de conectar con la base de datos (MongoDB), preparar los pagos
// seguros (Stripe) y guardar los archivos subidos por los clientes.
// Desarrollador: Adrián Regadera
// ============================================================================

require('dotenv').config(); // Carga nuestras claves secretas desde el archivo .env (Seguridad)
const express = require('express'); // Framework principal para arrancar el servidor web
const cors = require('cors'); // Permite que nuestra web se comunique con el servidor sin bloqueos de seguridad
const mongoose = require('mongoose'); // Herramienta para gestionar la base de datos MongoDB
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Herramienta de cobros iniciada con nuestra clave secreta
const path = require('path'); // Ayuda a manejar las rutas de las carpetas en el servidor
const multer = require('multer'); // Herramienta que nos permite recibir archivos (ej. Título Náutico en PDF)

const aplicacionServidor = express(); // Iniciamos nuestra aplicación de servidor
const PUERTO = process.env.PORT || 3000; // Definimos el puerto donde escuchará (Render usa el suyo propio, en local usa 3000)

// ============================================================================
// 1. CONFIGURACIÓN BÁSICA DEL SERVIDOR
// ============================================================================
aplicacionServidor.use(cors()); // Damos permiso para recibir peticiones de nuestra propia web
aplicacionServidor.use(express.json()); // Le decimos al servidor que entienda los datos en formato moderno (JSON)
aplicacionServidor.use(express.static('Proyecto_Legal_Final')); // Le indicamos la carpeta donde están nuestros HTML, CSS y JS

// ============================================================================
// 2. CONFIGURACIÓN DE SUBIDA DE ARCHIVOS (MULTER)
// ============================================================================
// Configuramos una memoria temporal para guardar el archivo del cliente antes de subirlo a Mongo
const almacenamientoTemporal = multer.memoryStorage();
const gestorDeArchivos = multer({ storage: almacenamientoTemporal });

// ============================================================================
// 3. CONEXIÓN A LA BASE DE DATOS (MONGODB ATLAS)
// ============================================================================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🟢 CONECTADO A MONGODB ATLAS (Base de datos online conectada)'))
    .catch((errorDeConexion) => console.error('🔴 Error al conectar a la base de datos:', errorDeConexion));

// ============================================================================
// 4. MODELO DE DATOS (El "Molde" de nuestros Pedidos)
// Define cómo se guarda un pedido estructurado en la base de datos
// ============================================================================
const EsquemaDelPedido = new mongoose.Schema({
    nombre: String,          // Nombre completo del titular
    email: String,           // Correo electrónico de contacto
    telefono: String,        // Número de móvil
    direccion: String,       // Dirección postal de envío
    documento: {             // El archivo adjunto (Título Náutico)
        data: Buffer,        // Los datos del archivo en crudo
        contentType: String, // Formato del archivo (ej: image/png, application/pdf)
        fileName: String     // Nombre original del archivo que subió el cliente
    },
    fecha: { type: Date, default: Date.now }, // Fecha en la que se hace el pedido (se pone sola)
    pagado: { type: Boolean, default: false }, // Estado del pago (Por defecto: no pagado)
    stripeId: String         // Código secreto de Stripe para vincular el pedido con el pago
});

const ModeloDePedido = mongoose.model('Pedido', EsquemaDelPedido);

// ============================================================================
// 5. RUTAS DEL SERVIDOR (APIs) - Las "puertas" que usa nuestra web para pedir cosas
// ============================================================================

// ----------------------------------------------------------------------------
// RUTA A: INICIAR EL PAGO SEGURO CON STRIPE
// La web nos llama aquí cuando carga la página de contacto para preparar la pasarela
// ----------------------------------------------------------------------------
aplicacionServidor.post('/api/crear-intento-pago', async (peticion, respuesta) => {
    try {
        // Le ordenamos a Stripe que prepare un pago inminente
        const intentoDePago = await stripe.paymentIntents.create({
            amount: 2990, // Cantidad en céntimos (2990 = 29,90€)
            currency: 'eur', // Moneda de cobro: Euros
            automatic_payment_methods: { enabled: true }, // Esto es lo que activa Apple Pay, Google Pay, Klarna, etc.
        });
        
        // Le devolvemos a la web el "secreto" para que muestre la tarjeta al cliente
        respuesta.send({ clientSecret: intentoDePago.client_secret });
    } catch (errorDeStripe) {
        respuesta.status(500).send({ error: errorDeStripe.message });
    }
});

// ----------------------------------------------------------------------------
// RUTA B: GUARDAR EL PEDIDO Y EL ARCHIVO EN LA BASE DE DATOS
// La web nos llama aquí en cuanto el cliente pulsa el botón azul de "PAGAR 29,90€"
// ----------------------------------------------------------------------------
aplicacionServidor.post('/api/guardar-pedido', gestorDeArchivos.single('documento'), async (peticion, respuesta) => {
    try {
        console.log("💾 Iniciando guardado de datos del cliente en la nube...");
        
        const datosDelFormulario = peticion.body; // Los textos escritos por el cliente (Nombre, Email...)
        const archivoSubido = peticion.file;      // El archivo que ha adjuntado (si existe)

        // Preparamos el "paquete" con la información estructurada
        const datosParaNuevoPedido = {
            nombre: datosDelFormulario.nombre,
            email: datosDelFormulario.email,
            telefono: datosDelFormulario.telefono,
            direccion: datosDelFormulario.direccion,
            stripeId: datosDelFormulario.stripeId 
        };

        // Si el cliente subió un archivo, lo metemos en el paquete
        if (archivoSubido) {
            datosParaNuevoPedido.documento = {
                data: archivoSubido.buffer,
                contentType: archivoSubido.mimetype,
                fileName: archivoSubido.originalname
            };
        }

        // Usamos el "molde" que creamos arriba para asegurar la calidad de los datos y guardamos
        const pedidoFinalParaGuardar = new ModeloDePedido(datosParaNuevoPedido);
        await pedidoFinalParaGuardar.save();

        console.log("✅ Pedido y título náutico guardados correctamente.");
        
        // Le decimos a la página web que todo ha sido un éxito para que continúe cobrando
        respuesta.json({ status: 'success' });

    } catch (errorAlGuardar) {
        console.error("❌ Error grave al intentar guardar el pedido:", errorAlGuardar);
        respuesta.status(500).json({ status: 'error', mensaje: errorAlGuardar.message });
    }
});

// ----------------------------------------------------------------------------
// RUTA C: ENVIAR LA PÁGINA PRINCIPAL
// Si alguien entra al servidor directamente, le mandamos el index.html
// ----------------------------------------------------------------------------
aplicacionServidor.get('/', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, 'Proyecto_Legal_Final', 'index.html'));
});

// ============================================================================
// 6. ENCENDER EL SERVIDOR
// ============================================================================
aplicacionServidor.listen(PUERTO, () => {
    console.log(`🚀 Servidor backend de "Legal Intermedia" operativo en el puerto ${PUERTO}`);
});