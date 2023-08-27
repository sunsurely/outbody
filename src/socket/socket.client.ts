import { Injectable, OnModuleInit } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class SocketClient implements OnModuleInit {
  public socketClient: Socket;

  constructor() {
    this.socketClient = io('http://localhost:3000');
  }

  onModuleInit() {
    this.registerConsumerEvent();
  }

  private registerConsumerEvent() {
    this.socketClient.emit('newMessage', {
      message: 'hey there!',
    });
    this.socketClient.on('connect', () => {
      console.log('Connectect to Gateway');
    });
    this.socketClient.on('onMessaage', (payload: any) => {
      console.log(payload);
    });
  }
}
