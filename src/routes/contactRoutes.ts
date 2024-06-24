import express, { Request, Response } from 'express';
const router = express.Router();
import Contact from '../models/Contact';

// Create a contact
router.post('/contacts', async (req: Request, res: Response) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).send(contact);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all contacts
router.get('/contacts', async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find();
    res.status(200).send(contacts);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific contact
router.get('/contacts/:id', async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).send();
    }

    res.send(contact);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a contact
router.patch('/contacts/:id', async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['first_name', 'last_name', 'company', 'email', 'url', 'address', 'birthday', 'other_date_type', 'other_date', 'note', 'phones', 'social_media'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).send();
    }

    updates.forEach(update => {
      (contact as any)[update] = req.body[update];
    });
    await contact.save();
    res.send(contact);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Merge contacts for a contact
router.patch('/contacts/:id/merge', async (req: Request, res: Response) => {
  const { contacts } = req.body;

  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).send('Contact not found');
    }

    // Assume merging logic here with existing contacts in contact object
    // For example, adding new contacts to existing ones

    (contact as any).phones.push(...contacts); // Assuming contacts is an array of new contacts
    await contact.save();

    res.status(200).send(contact);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a contact
router.delete('/contacts/:id', async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).send();
    }

    res.send(contact);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
