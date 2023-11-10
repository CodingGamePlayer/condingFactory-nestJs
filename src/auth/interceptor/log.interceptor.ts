import { map, observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const req = context.switchToHttp().getRequest();

    const path = req.originalUrl;

    const now = new Date();

    console.log(`[REQ] ${path} ${now.toLocaleString('kr')}`);

    return next.handle().pipe(
      tap((observable) =>
        console.log(
          `[RES] ${path} ${new Date().toLocaleDateString('kr')} ${
            new Date().getMilliseconds() - now.getMilliseconds()
          }ms`,
        ),
      ), // tap은 reponse의 값을 확인할 때 사용합니다.
      //   map((observable) => { // map은 response를 변경할 때 사용합니다.
      //     return {
      //       message: '응답이 변경 되었습니다.',
      //       response: observable,
      //     };
      //   }),
    );
  }
}
