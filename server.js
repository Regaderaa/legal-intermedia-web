require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');
const multer = require('multer'); // NUEVO: Para gestionar archivos

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE MULTER (Subida de archivos) ---
// Usamos memoria para no depender del disco de Render (que se borra)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- ENSEÑAR LA PÁGINA WEB ---
app.use(express.static('Proyecto_Legal_Final'));

// --- 1. CONEXIÓN A MONGODB ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🟢 CONECTADO A MONGODB ATLAS'))
    .catch((err) => console.error('🔴 Error Mongo:', err));

// --- 2. MODELO DE PEDIDO ACTUALIZADO ---
const PedidoSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    telefono: String,
    direccion: String,
    // NUEVO: Campo para guardar el archivo
    documento: {
        data: Buffer,       // Los datos binarios del archivo
        contentType: String, // Tipo de archivo (pdf, png, etc)
        fileName: String    // Nombre original
    },
    fecha: { type: Date, default: Date.now },
    pagado: { type: Boolean, default: false }
});
const Pedido = mongoose.model('Pedido', PedidoSchema);

// --- 3. RUTAS ---

// RUTA MAGICA: Crea el enlace de pago Y guarda el archivo
// 'upload.single' intercepta el archivo que viene del formulario
app.post('/api/crear-sesion-pago', upload.single('documento'), async (req, res) => {
    try {
        console.log("📦 Procesando pedido...");
        
        // En multipart, los textos vienen en req.body y el archivo en req.file
        const datosTexto = req.body;
        const archivo = req.file;

        console.log("👤 Cliente:", datosTexto.nombre);
        console.log("📄 Archivo recibido:", archivo ? archivo.originalname : 'Sin archivo');

        // A) Preparamos el objeto para guardar en Mongo
        const nuevoPedidoData = {
            nombre: datosTexto.nombre,
            email: datosTexto.email,
            telefono: datosTexto.telefono,
            direccion: datosTexto.direccion,
        };

        // Si ha subido archivo, lo añadimos
        if (archivo) {
            nuevoPedidoData.documento = {
                data: archivo.buffer,
                contentType: archivo.mimetype,
                fileName: archivo.originalname
            };
        }

        // Guardamos en MongoDB
        const nuevoPedido = new Pedido(nuevoPedidoData);
        await nuevoPedido.save();

        // B) Pedimos a Stripe un enlace de pago
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: 'Tarjeta Digital NFC - Legal Intermedia',
                    },
                    unit_amount: 2990, 
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.headers.origin}/index.html?pago=exito`,
            cancel_url: `${req.headers.origin}/contacto.html?pago=cancelado`,
        });

        res.json({ status: 'success', url: session.url });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ status: 'error', mensaje: error.message });
    }
});

// NUEVO: Si entran a la ruta principal, les damos el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Proyecto_Legal_Final', 'index.html'));
});

app.listen(PORT, () => console.log(`✅ Servidor listo en puerto ${PORT}`));