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
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entity/users.entity';
import { CommentsService } from './comments.service';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { PaginateCommentDto } from './dto/paginate-comment.dto';
import { UpdateCommentDto } from './dto/update-comments.dto';
import { IsCommentMineOrAdminGuard } from './guard/is-comment-mind-or-admin.guard';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @IsPublic()
  getComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() dto: PaginateCommentDto,
  ) {
    return this.commentsService.pagenateComments(dto, postId);
  }

  @Get(':commentId')
  @IsPublic()
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
  @UseGuards(IsCommentMineOrAdminGuard)
  async patchComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() body: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(body, commentId);
  }

  @Delete(':commentId')
  @UseGuards(IsCommentMineOrAdminGuard)
  deleteComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentsService.deleteComment(commentId);
  }
}
