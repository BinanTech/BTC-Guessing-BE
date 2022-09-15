import {
    WebSocketGateway,
    SubscribeMessage,
    WsResponse,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
  } from '@nestjs/websockets';
  import { Observable } from 'rxjs';
  
  import { JwtService } from '../auth/jwt/jwt.service';
  import { User } from '../users/interfaces/user.interface';
  import { UsersService } from '../users/users.service';
  
  @WebSocketGateway(1080, { namespace: 'rooms' })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server;
  
    connectedUsers: string[] = [];
  
    constructor(
      private jwtService: JwtService
    ) {}
  
    async handleConnection(socket) {
      const user: User = await this.jwtService.verify(
        socket.handshake.query.token,
        true
      );
  
      this.connectedUsers = [...this.connectedUsers, String(user._id)];
  
      // Send list of connected users
      this.server.emit('users', this.connectedUsers);
    }
  
    async handleDisconnect(socket) {
      const user: User = await this.jwtService.verify(
        socket.handshake.query.token,
        true
      );
      const userPos = this.connectedUsers.indexOf(String(user._id));
  
      if (userPos > -1) {
        this.connectedUsers = [
          ...this.connectedUsers.slice(0, userPos),
          ...this.connectedUsers.slice(userPos + 1)
        ];
      }
  
      // Sends the new list of connected users
      this.server.emit('users', this.connectedUsers);
    }
  
    @SubscribeMessage('message')
    async onMessage(client, data: any) {
      const event: string = 'message';
      const result = data[0];
  
      return Observable.create(observer =>
        observer.next({ event, data: result.message })
      );
    }
  
    @SubscribeMessage('join')
    async onRoomJoin(client, data: any): Promise<any> {
      client.join(data[0]);
  
      // Send last messages to the connected user
      client.emit('message', data[0]);
    }
  
    @SubscribeMessage('leave')
    onRoomLeave(client, data: any): void {
      client.leave(data[0]);
    }
  }
  