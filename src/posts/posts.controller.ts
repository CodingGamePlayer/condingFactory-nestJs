import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostModel, PostsService } from './posts.service';

/**
 * author : string;
 * title : string;
 * content : string;
 * likeCount : number;
 * commentCount : number;
 */

let posts: PostModel[] = [
  {
    id: 1,
    author: 'JaeSeoKim2',
    title: 'NestJS',
    content: 'NestJS is Awesome',
    likeCount: 10000000,
    commentCount: 9999999,
  },
  {
    id: 2,
    author: 'JaeSeoKim2',
    title: 'NestJS',
    content: 'NestJS is Awesome',
    likeCount: 10000000,
    commentCount: 9999999,
  },
  {
    id: 3,
    author: 'JaeSeoKim3',
    title: 'NestJS',
    content: 'NestJS is Awesome',
    likeCount: 10000000,
    commentCount: 9999999,
  },
];

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  getPosts(): PostModel[] {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  getPost(@Param('id') id: string): PostModel {
    return this.postService.getPostById(+id);
  }

  @Post()
  postPosts(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): PostModel {
    return this.postService.createPost(author, title, content);
  }

  @Put(':id')
  putPost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.postService.updatePost(+id, author, title, content);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(+id);
  }
}
