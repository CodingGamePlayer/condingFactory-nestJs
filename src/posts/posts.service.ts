import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  createPost(authorId: number, title: string, content: string) {
    const post = this.postsRepository.create({
      author: {
        id: authorId,
      },
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = this.postsRepository.save(post);

    return newPost;
  }

  async updatePost(id: number, title: string, content: string) {
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
