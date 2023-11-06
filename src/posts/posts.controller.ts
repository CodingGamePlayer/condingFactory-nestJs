import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

/**
 * author : string;
 * title : string;
 * content : string;
 * likeCount : number;
 * commentCount : number;
 */

interface Post {
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

@Controller('posts')
export class PostsController {
  constructor(private readonly appService: PostsService) {}

  @Get('')
  getPost(): Post {
    return {
      author: 'JaeSeoKim',
      title: 'NestJS',
      content: 'NestJS is Awesome',
      likeCount: 10000000,
      commentCount: 9999999,
    };
  }
}
