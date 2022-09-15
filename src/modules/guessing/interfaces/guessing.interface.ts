import { Document } from 'mongoose';

export interface Guessing extends Document {
  readonly userId: string;
  readonly score: string;
  readonly guessedValue: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}