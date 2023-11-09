import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostModel, PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entities/users.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';

/**
 * author : string;
 * title : string;
 * content : string;
 * likeCount : number;
 * commentCount : number;
 */

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  getPosts(@Query() query: PaginatePostDto) {
    return this.postService.paginatePosts(query);
  }

  @Post('random')
  @UseGuards(AccessTokenGuard)
  async postPostRandom(@User() user: UsersModel) {
    await this.postService.generatePosts(user.id);

    return true;
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  postPosts(
    @User() user: UsersModel,
    @Body() body: CreatePostDto,
    // @Body('title') title: string,
    // @Body('content') content: string,
  ) {
    return this.postService.createPost(user.id, body);
  }

  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
    // @Body('title') title?: string,
    // @Body('content') content?: string,
  ) {
    return this.postService.updatePost(id, body);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.deletePost(+id);
  }
}
