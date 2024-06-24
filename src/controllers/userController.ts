import { Request, Response } from 'express';
import User, { UserDocument } from '../models/User'; // Adjust the import path as per your project structure

// Create a user
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a specific user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['email', 'password'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    updates.forEach(update => {
      (user as any)[update] = req.body[update];
    });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Merge contacts for a user
export const mergeContacts = async (req: Request, res: Response) => {
  const { userId, contacts } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Ensure TypeScript recognizes 'contacts' as an array of Contact objects
    (user as UserDocument).contacts.push(...contacts); // Cast user as UserDocument to access contacts
    await user.save();

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Predictive search for users
export const predictiveSearch = async (req: Request, res: Response) => {
  const { query } = req.query;

  try {
    // Example: Perform a search query on User model based on the 'query' parameter
    const results = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    });

    res.status(200).send(results);
  } catch (error) {
    res.status(500).send(error);
  }
};

export default { 
  createUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  mergeContacts, 
  predictiveSearch 
};
