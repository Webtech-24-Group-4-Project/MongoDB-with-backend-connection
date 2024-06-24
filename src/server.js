"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });

const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const mongoose_1 = __importDefault(require("mongoose"));

dotenv_1.default.config(); // Load environment variables from .env file

const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(body_parser_1.default.json());

// Routes
app.use('/users', userRoutes_1.default);
app.use('/contacts', contactRoutes_1.default);

// Database connection
const dbUri = process.env.MONGO_URI;
mongoose_1.default.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB', error);
    });

