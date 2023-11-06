import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('post')
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
