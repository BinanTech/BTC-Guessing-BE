import { Module } from '@nestjs/common';

// Modules
import { UsersModule } from '../users/users.module';
import { GuessingModule } from '../guessing/guessing.module';

// Components
import { AuthService } from './auth.service';
import { JwtService } from './jwt/jwt.service';

// Controllers
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule, GuessingModule],
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  exports: [JwtService]
})
export class AuthModule {}
