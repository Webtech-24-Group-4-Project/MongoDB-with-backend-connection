import mongoose, { Schema, Document } from 'mongoose';

export interface Contact {
  name: string;
  phone: string;
  email: string;
}

export interface UserDocument extends Document {
  email: string;
  password: string;
  contacts: Contact[];
}

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  contacts: [{ name: String, phone: String, email: String }]
});

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
