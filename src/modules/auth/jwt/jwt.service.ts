import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as os from 'os';
import { User } from '../../users/interfaces/user.interface';
import { UsersService } from '../../users/users.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Generates a new JWT token
   *
   * @param {User} user - The user to create the payload for the JWT
   * @returns {Promise} tokens - The access and the refresh token
   */
  async generateToken(user: User): Promise<any> {
    const payload = {
      sub: {
        _id: user._id,
        email: user.email,
        username: user.username
      },
      iss: os.hostname()
    };
    const accessToken = await jwt.sign(payload, process.env.jwtSecret, {
      expiresIn: process.env.accessTokenExpires
    });
    const refreshToken = await jwt.sign(payload, process.env.jwtSecret, {
      expiresIn: process.env.refreshTokenExpires
    });

    return { accessToken, refreshToken };
  }

  /**
   * Validates the token
   *
   * @param {string} token - The JWT token to validate
   * @param {boolean} isWs - True to handle WS exception instead of HTTP exception (default: false)
   */
  async verify(token: string, isWs: boolean = false): Promise<User | null> {
    try {
      const payload = <any>jwt.verify(token, process.env.jwtSecret);
      const user = await this.usersService.findById(payload.sub._id);

      if (!user) {
        if (isWs) {
          throw new WsException('Unauthorized access');
        } else {
          throw new HttpException(
            'Unauthorized access',
            HttpStatus.BAD_REQUEST
          );
        }
      }

      return user;
    } catch (err) {
      if (isWs) {
        throw new WsException(err.message);
      } else {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
