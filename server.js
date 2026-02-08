require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path'); // NUEVO: Para encontrar carpetas

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- NUEVO: ENSEÑAR LA PÁGINA WEB ---
// Le decimos al servidor que la carpeta 'Proyecto_Legal_Final' es pública
app.use(express.static('Proyecto_Legal_Final'));

// --- 1. CONEXIÓN A MONGODB ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🟢 CONECTADO A MONGODB ATLAS'))
    .catch((err) => console.error('🔴 Error Mongo:', err));

// --- 2. MODELO DE PEDIDO ---
const PedidoSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    telefono: String,
    direccion: String,
    fecha: { type: Date, default: Date.now },
    pagado: { type: Boolean, default: false }
});
const Pedido = mongoose.model('Pedido', PedidoSchema);

// --- 3. RUTAS ---

// RUTA MAGICA: Crea el enlace de pago
app.post('/api/crear-sesion-pago', async (req, res) => {
    try {
        const datos = req.body;
        console.log("📦 Procesando pedido para:", datos.nombre);

        // A) Guardamos el pedido en MongoDB
        const nuevoPedido = new Pedido(datos);
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
            // OJO: En internet no existe localhost, pero Render lo arreglará solo con esto:
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