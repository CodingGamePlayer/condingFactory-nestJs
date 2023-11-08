/**
 * 구현할 기능
 *
 * 1) 요청객체를 불러오고
 *      authorization header 로부터 토큰을 추출한다.
 * 2) authService를 통해 토큰을 추출
 * 3) 추출된 토큰을 verify한다.
 * 4) email과 password를 이용해서 사용자를 가져온다.
 * 5) 찾아낸 사용자를 1 요청 객체에 붙여준다.
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const rawToken = req.headers.authorization;

    if (!rawToken) {
      throw new UnauthorizedException('토큰이 존재하지 않습니다.');
    }

    const token = this.authService.extractTokenFromHeaders(rawToken, false);

    const { email, password } = this.authService.decodeBasicToken(token);

    const user = await this.authService.authenticateWithEmailAndPassword({
      email,
      password,
    });

    req.user = user;

    return true;
  }
}
