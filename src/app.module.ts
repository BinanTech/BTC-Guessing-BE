import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GuessingModule } from './modules/guessing/guessing.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/nest', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
    UsersModule,
    AuthModule,
    GuessingModule,
    ChatModule
  ],
})
export class AppModule { }
