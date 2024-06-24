import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
//import multer from 'multer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.DATABASE_CONNECTION_STRING!,
     { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
// Import and use your routes here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
