import { Router } from 'express';
import Contact from '../models/Contact';

const router = Router();

// Създаване на контакт
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).send(contact);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Получаване на всички контакти
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).send(contacts);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Получаване на конкретен контакт
router.get('/:id', async (req, res) => {
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

// Обновяване на контакт
router.put('/:id', async (req, res) => {
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

// Изтриване на контакт
router.delete('/:id', async (req, res) => {
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

// Predictive search
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const contacts = await Contact.find({
      $or: [
        { first_name: new RegExp(query, 'i') },
        { last_name: new RegExp(query, 'i') },
        { company: new RegExp(query, 'i') },
        { email: new RegExp(query, 'i') }
      ]
    });
    res.send(contacts);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Сливане на контакти
router.post('/merge', async (req, res) => {
  const { sourceId, targetId } = req.body;
  
  try {
    const sourceContact = await Contact.findById(sourceId);
    const targetContact = await Contact.findById(targetId);
    
    if (!sourceContact || !targetContact) {
      return res.status(404).send({ error: 'Contact not found!' });
    }

    // Merge phones
    sourceContact.phones.forEach(phone => targetContact.phones.push(phone));
    
    // Merge social media
    sourceContact.social_media.forEach(social => targetContact.social_media.push(social));
    
    await targetContact.save();
    await Contact.findByIdAndDelete(sourceId);
    
    res.send(targetContact);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;


