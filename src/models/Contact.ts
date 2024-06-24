import { Schema, model } from 'mongoose';

const contactSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  company: String,
  email: String,
  url: String,
  address: {
    street: String,
    city: String,
    state: String,
    postal_code: String,
    country: String
  },
  birthday: Date,
  other_date_type: { type: String, enum: ['anniversary', 'other'], required: true },
  other_date: Date,
  note: String,
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  phones: [
    {
      phone_number: String,
      phone_type: { type: String, enum: ['work', 'personal', 'home'], required: true }
    }
  ],
  social_media: [
    {
      platform: String,
      username: String
    }
  ]
});

const Contact = model('Contact', contactSchema);
export default Contact;
