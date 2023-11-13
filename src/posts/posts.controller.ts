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
  UseInterceptors,
} from '@nestjs/common';
import { TransactionInterceptor } from 'src/auth/interceptor/transaction.interceptor';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { ImageModelType } from 'src/common/entity/image.entity';
import { RolesEnum } from 'src/users/const/roles.enum';
import { Roles } from 'src/users/decorator/roles.decorator';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entity/users.entity';
import { DataSource, QueryRunner as QR } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IsPostMineOrAdminGuard } from './guard/is-post-mind-or-admin.guard';
import { PostsImagesService } from './image/dto/image.service';
import { PostsService } from './posts.service';

/**
 * author : string;
 * title : string;
 * content : string;
 * likeCount : number;
 * commentCount : number;
 */

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postService: PostsService,
    private readonly dataSource: DataSource,
    private readonly postsImagesService: PostsImagesService,
  ) {}

  @Get()
  // @UseInterceptors(LogInterceptor)
  // @UseFilters(HttpExceptionFilter)
  @IsPublic()
  getPosts(@Query() query: PaginatePostDto) {
    return this.postService.paginatePosts(query);
  }

  @Post('random')
  async postPostRandom(@User() user: UsersModel) {
    await this.postService.generatePosts(user.id);

    return true;
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostById(id);
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async postPosts(
    @User() user: UsersModel,
    @Body() body: CreatePostDto,
    @QueryRunner() qr: QR,
    // @Body('title') title: string,
    // @Body('content') content: string,
  ) {
    const post = await this.postService.createPost(user.id, body, qr);

    for (let i = 0; i < body.images.length; i++) {
      await this.postsImagesService.createPostImage(
        {
          post,
          order: i,
          path: body.images[i],
          type: ImageModelType.POST_IMAGE,
        },
        qr,
      );
    }

    return this.postService.getPostById(post.id, qr);
  }

  @Patch(':postId')
  @UseGuards(IsPostMineOrAdminGuard)
  patchPost(
    @Param('postId', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
    // @Body('title') title?: string,
    // @Body('content') content?: string,
  ) {
    return this.postService.updatePost(id, body);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.deletePost(+id);
  }
}
