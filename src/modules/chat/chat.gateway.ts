import {
  WebSocketGateway,
  SubscribeMessage,
  WsResponse,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Observable } from 'rxjs';

import { JwtService } from '../auth/jwt/jwt.service';
import { GuessingService } from '../guessing/guessing.service';
import { User } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';
import { getBTCPrice } from './chat.service';
import { CronJob } from 'cron';

const options = {
  cors: {
    origin: ['*.*'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '',
};

@WebSocketGateway(options)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server;

  connectedSockets: any = {};
  btcPrice: number;
  oldPrice: number;

  gettingPriceJob: CronJob | null;
  broadcastPriceJob: CronJob;
  sendingScoreJob: CronJob;

  constructor(
    private jwtService: JwtService,
    private guessServie: GuessingService,
  ) {}

  async setBTCPrice() {
    const btcPrice: string = await getBTCPrice();

    if (btcPrice) {
      this.oldPrice = this.btcPrice;
      this.btcPrice = parseFloat(btcPrice);
    }
  }

  async sendScore() {
    if (this.connectedSockets && Object.keys(this.connectedSockets).length) {
      Object.keys(this.connectedSockets).forEach(async (key) => {
        let guess = await this.guessServie.find(key);
        const difference = this.btcPrice - this.oldPrice;
        if (this.connectedSockets[key]?.guessing && guess && difference) {
          let result = false;
          if (difference > 0) {
            result = this.connectedSockets[key].guessing === 'up';
          } else if (difference < 0) {
            result = this.connectedSockets[key].guessing === 'down';
          }
          let score = !guess?.score ? 0 : parseInt(guess.score);
          if (result) score++;
          else score--;
          await this.guessServie.update(
            guess.userId,
            score,
            this.connectedSockets[key].guessing,
          );
          this.connectedSockets[key].guessing = '';
          guess.score = score.toString();
        }
        const result = {
          ...guess,
          oldPrice: this.oldPrice,
          currentPrice: this.btcPrice,
        };
        this.server
          .to(this.connectedSockets[key].socket)
          .emit('score', JSON.stringify(result));
      });
      console.log('===================  sent score !!! ===================>');
    }
  }

  async handleConnection(socket) {
    if (socket?.handshake?.query?.token !== 'undefined') {
      const user: User = await this.jwtService.verify(
        socket.handshake.query.token,
        true,
      );

      if (user?._id) {
        this.connectedSockets[user._id] = { socket: socket.id, guessing: '' };
        if (!this.gettingPriceJob) {
          this.gettingPriceJob = new CronJob(
            `0 */${process.env.NEST_PER_MINUTES} * * * *`,
            async () => {
              await this.setBTCPrice();
              await this.sendScore();
            },
          );
          this.gettingPriceJob.start();
          console.log('============== started !!! ==================>');
        }
      }
    }
  }

  async handleDisconnect(socket) {
    const key = Object.keys(this.connectedSockets).find(
      (value: string) => this.connectedSockets[value]?.socket === socket.id,
    );
    if (key) delete this.connectedSockets[key];
    if (Object.keys(this.connectedSockets)?.length < 1) {
      this.gettingPriceJob.stop();
      this.gettingPriceJob = null;
      console.log('============== stopped !!! ==================>');
    }
  }

  @SubscribeMessage('guess')
  async onRoomJoin(client, data: any) {
    const guessingData = JSON.parse(data);
    if (guessingData?.userId && this.connectedSockets[guessingData.userId]) {
      this.connectedSockets[guessingData.userId].guessing = guessingData?.guess;
    }
    client.emit('recieved');
  }
}
