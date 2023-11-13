import {
  BadRequestException,
  CanActivate,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { RolesEnum } from 'src/users/const/roles.enum';
import { PostsService } from '../posts.service';
@Injectable()
export class IsPostMineOrAdminGuard implements CanActivate {
  constructor(private readonly postService: PostsService) {}

  async canActivate(context: ExecutionContextHost) {
    const req = context.switchToHttp().getRequest();

    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('사용자의 정보를 가져올 수 없습니다.');
    }

    if (user.role === RolesEnum.ADMIN) {
      return true;
    }

    const postId = req.params.postId;

    if (!postId) {
      throw new BadRequestException('postId가 존재하지 않습니다.');
    }

    const isOk = await this.postService.isPostMine(user.id, parseInt(postId));

    if (!isOk) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    return true;
  }
}
