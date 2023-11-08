import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersServie: UsersService,
  ) {}
  /**
   * 우리가 만들 기능
   * 1. registerWithEmail
   *  - email, nickname, password를 받아서 사용자를 생성한다.
   *  - 생성이 완료되면 accessToken과 refreshToken을 반환한다.
   *
   * 2. loginWithEmail
   *  - email, password를 받아서 사용자 검증을 진행한다.
   *  - 검증이 완료되면 accessToken과 refreshToken을 반환한다.
   *
   * 3. loginUser
   *  - (1)과 (2) 에서 필요한 accessToken과 refreshToken을 반환하는 로직
   *
   * 4. signToken
   *  - (3) 에서 필요한 accessToken과 refreshToken을 sign하는 로직
   *
   * 5. authenticateWithEmailAndPassword
   *  - (2)에서 로그인을 진행할때 필요한 기본적인 검증 진행
   *      - 사용자가 존재하는지
   *      - 비밀번호가 일치하는지
   *      - 모두 통과하면 사용자 정보를 반환한다.
   *      - loginWirhEmail에서 반환된 데이터를 기반으로 토큰을 생성한다.
   */

  /**
   * Payload에 들어가는 정보
   *
   * 1. email
   * 2. sub -> id
   * 3. type : access | refresh
   */
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    const existingUser = await this.usersServie.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    const passOk = await bcrypt.compare(user.password, existingUser.password);

    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    return existingUser;
  }

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(existingUser);
  }

  async registerWithEmail(
    user: Pick<UsersModel, 'nickname' | 'email' | 'password'>,
  ) {
    const hash = await bcrypt.hash(user.password, HASH_ROUNDS);

    const newUser = await this.usersServie.createUser({
      ...user,
      password: hash,
    });

    return this.loginUser(newUser);
  }
}
