import { Module } from '@nestjs/common';

// Modules
import { GuessingModule } from '../guessing/guessing.module';
import { AuthModule } from '../auth/auth.module';

// Components
import { ChatGateway } from './chat.gateway';
import { JwtService } from '../auth/jwt/jwt.service';


@Module({
  imports: [AuthModule, GuessingModule],
  providers: [ChatGateway],
})
export class ChatModule {}
