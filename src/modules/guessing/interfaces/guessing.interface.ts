import { Document } from 'mongoose';

export interface Guessing extends Document {
  readonly userId: string;
  score: string;
  guessedValue: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}