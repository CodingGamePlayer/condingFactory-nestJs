import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class SocketBearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient();
    try {
      const headers = socket.handshake.headers;

      const rawToken = headers.authorization;

      if (!rawToken) {
        throw new WsException('토큰이 없습니다.');
      }

      const token = this.authService.extractTokenFromHeaders(rawToken, true);

      const payload = this.authService.verifyToken(token);
      const user = await this.usersService.getUserByEmail(payload.email);

      if (!user) {
        throw new WsException('존재하지 않는 유저입니다.');
      }

      socket.user = user;
      socket.token = token;
      socket.tokenType = payload.tokenType;

      return true;
    } catch (error) {
      socket.disconnect();
    }
  }
}
