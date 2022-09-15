import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GuessingController } from './guessing.controller';
import { GuessingService } from './guessing.service';
import { GuessingSchema } from './schemas/guessing.schmas';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Guessing', schema: GuessingSchema }])],
    controllers: [GuessingController],
    providers: [GuessingService],
    exports: [GuessingService]
  })
  export class GuessingModule {}