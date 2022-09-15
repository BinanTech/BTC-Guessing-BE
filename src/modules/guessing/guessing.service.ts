import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Guessing } from './interfaces/guessing.interface';

@Injectable()
export class GuessingService {
  constructor(
    @InjectModel('Guessing') private readonly GuessingModel: Model<Guessing>
  ) {}

  async create(userId: string): Promise<any> {
    const createdGuessing = await this.GuessingModel.findOne({ userId }).exec();
    if (createdGuessing) {
      return createdGuessing;
    } else {
      return await new this.GuessingModel({ userId }).save();
    }      
  }

  async update(userId: string, score: number, guessedValue: string): Promise<any> {
    return await this.GuessingModel.updateOne({userId, score, guessedValue}).exec();
  }

  async delete(userId: string): Promise<any> {
    return await this.GuessingModel.deleteOne({ userId }).exec();
  }
}
