import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Guessing } from './interfaces/guessing.interface';

@Injectable()
export class GuessingService {
  constructor(
    @InjectModel('Guessing') private readonly GuessingModel: Model<Guessing>,
  ) {}

  async create(userId: string) {
    const createdGuessing = await this.GuessingModel.findOne({ userId });
    if (createdGuessing) {
      return createdGuessing;
    } else {
      return await new this.GuessingModel({ userId }).save();
    }
  }

  async find(userId: string) {
    let guess = await await this.GuessingModel.findOne({ userId: userId });
    if (guess) {
      guess = guess.schema.methods.serialize(guess);
    }
    return guess;
  }

  async update(
    userId: string,
    score: number,
    guessedValue: string,
  ) {
    return await this.GuessingModel.updateOne({userId}, {
      score,
      guessedValue,
    });
  }

  async delete(userId: string) {
    return await this.GuessingModel.deleteOne({ userId });
  }
}
