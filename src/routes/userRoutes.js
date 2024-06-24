"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Contact_1 = __importDefault(require("../models/Contact"));

const router = (0, express_1.Router)();

// Create a contact
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contact = new Contact_1.default(req.body);
        yield contact.save();
        res.status(201).send(contact);
    }
    catch (error) {
        res.status(400).send(error);
    }
}));

// Get all contacts
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield Contact_1.default.find();
        res.status(200).send(contacts);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));

// Get a specific contact
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contact = yield Contact_1.default.findById(req.params.id);

        if (!contact) {
            return res.status(404).send();
        }

        res.send(contact);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));

// Update a contact
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        'first_name', 'last_name', 'company', 'email', 'url', 'address',
        'birthday', 'other_date_type', 'other_date', 'note', 'user_id',
        'phones', 'social_media'
    ];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const contact = yield Contact_1.default.findById(req.params.id);

        if (!contact) {
            return res.status(404).send();
        }

        updates.forEach(update => {
            contact[update] = req.body[update];
        });
        yield contact.save();
        res.send(contact);
    }
    catch (error) {
        res.status(400).send(error);
    }
}));

// Delete a contact
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contact = yield Contact_1.default.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).send();
        }

        res.send(contact);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));

// Predictive search
router.get('/search/:query', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.params.query;
        const contacts = yield Contact_1.default.find({
            $or: [
                { first_name: new RegExp(query, 'i') },
                { last_name: new RegExp(query, 'i') },
                { company: new RegExp(query, 'i') },
                { email: new RegExp(query, 'i') }
            ]
        });
        res.send(contacts);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));

// Merge contacts
router.post('/merge', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sourceId, targetId } = req.body;
    
    try {
        const sourceContact = yield Contact_1.default.findById(sourceId);
        const targetContact = yield Contact_1.default.findById(targetId);
        
        if (!sourceContact || !targetContact) {
            return res.status(404).send({ error: 'Contact not found!' });
        }

        // Merge phones
        sourceContact.phones.forEach(phone => targetContact.phones.push(phone));
        
        // Merge social media
        sourceContact.social_media.forEach(social => targetContact.social_media.push(social));
        
        yield targetContact.save();
        yield Contact_1.default.findByIdAndDelete(sourceId);
        
        res.send(targetContact);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));

exports.default = router;
