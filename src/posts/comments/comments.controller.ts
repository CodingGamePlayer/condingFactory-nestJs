import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entity/users.entity';
import { CommentsService } from './comments.service';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { PaginateCommentDto } from './dto/paginate-comment.dto';

@Controller('posts/:postId/comments')
@UseGuards(AccessTokenGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  getComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() dto: PaginateCommentDto,
  ) {
    return this.commentsService.pagenateComments(dto, postId);
  }

  @Get(':commentId')
  getComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentsService.getCommentById(commentId);
  }

  @Post()
  postComment(
    @Body() body: CreateCommentsDto,
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: UsersModel,
  ) {
    return this.commentsService.createComment(body, postId, user);
  }

  @Patch(':commentId')
  patchComment() {
    return this.commentsService.updateComment();
  }

  @Delete(':commentId')
  deleteComment() {
    return this.commentsService.deleteComment();
  }
}
