import { Schema } from 'mongoose';

const guessing = new Schema({
  userId: { type: String, required: true, unique: true },
  score: { type: String },
  guessingValue: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

/**
 * On every save, add the date
 */
 guessing.pre('save', function(next) {
  const currentDate = new Date();

  this.updated_at = currentDate;
  next();
});

/**
 * Serialize user to send it throw the JWT token
 */
 guessing.methods.serialize = function(user) {
  return {
    _id: user._id,
    score: user.username
  };
};

export const GuessingSchema = guessing;
