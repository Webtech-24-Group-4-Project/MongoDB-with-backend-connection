import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/phonebookDB';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as ConnectOptions).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
