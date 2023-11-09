import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/pagenate-post.dto';
import { HOST, PROTOCOL } from 'src/auth/const/env.const';

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}
  async getAllPosts() {
    return await this.postsRepository.find({
      relations: {
        author: true,
      },
    });
  }

  async generatePosts(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createPost(userId, {
        title: `title${i}`,
        content: `content${i}`,
      });
    }
  }

  async paginatePosts(pageDto: PaginatePostDto) {
    const posts = await this.postsRepository.find({
      where: {
        id: MoreThan(pageDto.where__id_more_than ?? 0),
      },
      order: {
        createdAt: pageDto.order__createdAt,
      },
      take: pageDto.take,
    });

    const lastItem =
      posts.length > 0 && posts.length === pageDto.take
        ? posts[posts.length - 1]
        : null;

    const nextUrl = lastItem && new URL(`${PROTOCOL}://${HOST}/posts`);

    if (nextUrl) {
      for (const key of Object.keys(pageDto)) {
        if (key !== 'where__id_more_than') {
          nextUrl.searchParams.append(key, pageDto[key]);
        }
      }
    }

    nextUrl.searchParams.append('where__id_more_than', lastItem.id.toString());

    return {
      data: posts,
      cursor: lastItem?.id ?? null,
      count: posts.length,
      next: nextUrl?.toString() ?? null,
    };
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        author: true,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  createPost(authorId: number, postDto: CreatePostDto) {
    const post = this.postsRepository.create({
      author: {
        id: authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = this.postsRepository.save(post);

    return newPost;
  }

  async updatePost(id: number, postDto: UpdatePostDto) {
    const { title, content } = postDto;
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async deletePost(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    await this.postsRepository.delete(id);

    return id;
  }
}
