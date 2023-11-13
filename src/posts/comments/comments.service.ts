import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { UsersModel } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';
import { DEFAULT_COMMENT_FIND_OPTIONS } from './const/default-comment-find-options.const';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { PaginateCommentDto } from './dto/paginate-comment.dto';
import { UpdateCommentDto } from './dto/update-comments.dto';
import { CommentsModel } from './entity/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commonService: CommonService,
    @InjectRepository(CommentsModel)
    private readonly commentsRepository: Repository<CommentsModel>,
  ) {}
  async deleteComment(id: number) {
    const comment = await this.commentsRepository.findOne({
      where: {
        id,
      },
    });

    if (!comment) {
      throw new BadRequestException('존재하지 않는 댓글입니다.');
    }

    return this.commentsRepository.delete(id);
  }
  async updateComment(dto: UpdateCommentDto, commentId: number) {
    const comment = await this.commentsRepository.findOne({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new BadRequestException('존재하지 않는 댓글입니다.');
    }

    const prevComment = await this.commentsRepository.preload({
      id: commentId,
      ...dto,
    });

    const newComment = await this.commentsRepository.save(prevComment);

    return newComment;
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
      ...DEFAULT_COMMENT_FIND_OPTIONS,
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
        ...DEFAULT_COMMENT_FIND_OPTIONS,
      },
      `posts/${postId}/comments`,
    );
  }

  async isCommentMine(userId: number, postId: number) {
    return this.commentsRepository.exist({
      where: {
        id: postId,
        author: {
          id: userId,
        },
      },
      relations: {
        author: true,
      },
    });
  }
}
