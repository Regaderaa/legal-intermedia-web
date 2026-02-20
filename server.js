require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('Proyecto_Legal_Final'));

// Configuración de Multer (Memoria)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🟢 CONECTADO A MONGODB ATLAS'))
    .catch((err) => console.error('🔴 Error Mongo:', err));

// Modelo Pedido
const PedidoSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    telefono: String,
    direccion: String,
    documento: {
        data: Buffer,
        contentType: String,
        fileName: String
    },
    fecha: { type: Date, default: Date.now },
    pagado: { type: Boolean, default: false }, 
    stripeId: String 
});
const Pedido = mongoose.model('Pedido', PedidoSchema);

// --- RUTAS NUEVAS (LAS QUE FALTABAN) ---

// 1. RUTA PARA INICIAR EL PAGO (La que daba Error 404)
app.post('/api/crear-intento-pago', async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 2990, 
            currency: 'eur',
            automatic_payment_methods: { enabled: true }, 
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// 2. RUTA PARA GUARDAR EL PEDIDO Y EL ARCHIVO
app.post('/api/guardar-pedido', upload.single('documento'), async (req, res) => {
    try {
        console.log("💾 Guardando datos en Mongo...");
        const datosTexto = req.body;
        const archivo = req.file;

        const nuevoPedidoData = {
            nombre: datosTexto.nombre,
            email: datosTexto.email,
            telefono: datosTexto.telefono,
            direccion: datosTexto.direccion,
            stripeId: datosTexto.stripeId 
        };

        if (archivo) {
            nuevoPedidoData.documento = {
                data: archivo.buffer,
                contentType: archivo.mimetype,
                fileName: archivo.originalname
            };
        }

        const nuevoPedido = new Pedido(nuevoPedidoData);
        await nuevoPedido.save();

        console.log("✅ Pedido guardado correctamente.");
        res.json({ status: 'success' });

    } catch (error) {
        console.error("❌ Error al guardar:", error);
        res.status(500).json({ status: 'error', mensaje: error.message });
    }
});

// Ruta Frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Proyecto_Legal_Final', 'index.html'));
});

app.listen(PORT, () => console.log(`✅ Servidor listo en puerto ${PORT}`));