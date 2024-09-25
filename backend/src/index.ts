// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import binanceApiRoutes from './routes/binanceApiRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/binance', binanceApiRoutes);

app.listen(PORT, () => {
  console.log(`Api server running on http://localhost:${PORT}`);
});
