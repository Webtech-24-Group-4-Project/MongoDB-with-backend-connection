import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import contactRoutes from './routes/contactRoutes';
import './database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/contacts', contactRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
