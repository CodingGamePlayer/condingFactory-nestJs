import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

/**
 * author : string;
 * title : string;
 * content : string;
 * likeCount : number;
 * commentCount : number;
 */

interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

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
  constructor(private readonly appService: PostsService) {}

  @Get()
  getPosts(): PostModel[] {
    return posts;
  }
}
