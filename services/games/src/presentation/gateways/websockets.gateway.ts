import { Logger } from "@nestjs/common";
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: true })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    Logger.log(`[WebSockets] Server initialized successfully`);
  }

  handleConnection(client: Socket) {
    Logger.log(`[WebSockets] Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    Logger.log(`[WebSockets] Client disconnected ${client.id}`);
  }
}
