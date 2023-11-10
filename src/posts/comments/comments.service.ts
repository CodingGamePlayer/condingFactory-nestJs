import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { UsersModel } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { PaginateCommentDto } from './dto/paginate-comment.dto';
import { CommentsModel } from './entity/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commonService: CommonService,
    @InjectRepository(CommentsModel)
    private readonly commentsRepository: Repository<CommentsModel>,
  ) {}
  deleteComment() {
    throw new Error('Method not implemented.');
  }
  updateComment() {
    throw new Error('Method not implemented.');
  }
  createComment(dto: CreateCommentsDto, postId: number, author: UsersModel) {
    return this.commentsRepository.save({
      ...dto,
      post: {
        id: postId,
      },
      author,
    });
  }
  async getCommentById(id: number) {
    const comment = await this.commentsRepository.findOne({
      where: {
        id,
      },
    });

    if (!comment) {
      throw new BadRequestException(
        `id: ${id}에 해당하는 댓글이 존재하지 않습니다.`,
      );
    }

    return comment;
  }
  pagenateComments(dto: PaginateCommentDto, postId: number) {
    return this.commonService.paginate(
      dto,
      this.commentsRepository,
      {
        relations: {
          author: true,
        },
      },
      `posts/${postId}/comments`,
    );
  }
}
