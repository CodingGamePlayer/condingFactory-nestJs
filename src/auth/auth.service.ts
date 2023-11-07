import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
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
}
