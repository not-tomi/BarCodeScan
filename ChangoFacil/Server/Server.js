// const express = require('express');
// const mongoose = require('mongoose');
// const app = express();
// const port = 4321;

// // Conexión a MongoDB
// mongoose.connect('mongodb://localhost:27017/productdb', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// const ProductSchema = new mongoose.Schema({
//     barcode: String,
//     name: String,
//     price: Number,
// });

// const Product = mongoose.model('Product', ProductSchema);

// app.use(express.json());

// app.post('/verify-product', async (req, res) => {
//     const { barcode } = req.body;
//     const product = await Product.findOne({ barcode });

//     if (product) {
//         res.json(product);
//     } else {
//         res.status(404).json({ message: 'Producto no encontrado' });
//     }
// });

// app.listen(port, () => {
//     console.log(`Servidor escuchando en http://localhost:${port}`);
// });
