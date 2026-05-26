const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const queueRoutes = require('./routes/queueRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  return res.json({ message: 'API SSP Connect rodando.' });
});

// Rotas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes);
app.use('/queue', queueRoutes);
app.use('/destinations', destinationRoutes);
app.use('/categories', categoryRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
