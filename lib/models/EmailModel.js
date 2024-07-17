import mongoose from 'mongoose';

const Email = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const EmailModel = mongoose.models.email || mongoose.model('email', Email);

export default EmailModel;
