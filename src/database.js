'use strict';
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/phonebookDB';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
