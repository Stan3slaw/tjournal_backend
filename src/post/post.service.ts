import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/createPost.dto';
import { SearchPostDto } from './dto/searchPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}
  async create(createPostDto: CreatePostDto) {
    return await this.postRepository.save(createPostDto);
  }

  async findAll() {
    return await this.postRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findAllPopular() {
    const queryBuilder = this.postRepository
      .createQueryBuilder('posts')
      .orderBy('views', 'DESC');

    const [posts, total] = await queryBuilder.getManyAndCount();
    return { posts, total };
  }

  async searchPost(searchPostDto: SearchPostDto) {
    const queryBuilder = this.postRepository.createQueryBuilder('posts');

    queryBuilder.limit(searchPostDto.limit || 10);
    queryBuilder.offset(searchPostDto.offset || 0);

    if (searchPostDto.views) {
      queryBuilder.orderBy('views', searchPostDto.views);
    }

    if (searchPostDto.title) {
      queryBuilder.andWhere(`posts.title LIKE :title`, {
        title: `%${searchPostDto.title}%`,
      });
    }

    if (searchPostDto.body) {
      queryBuilder.andWhere(`posts.body LIKE :body`, {
        body: `%${searchPostDto.body}%`,
      });
    }

    if (searchPostDto.tag) {
      queryBuilder.andWhere(`posts.tag LIKE :tag`, {
        tag: `%${searchPostDto.tag}%`,
      });
    }

    const [posts, total] = await queryBuilder.getManyAndCount();
    return { posts, total };
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne(id);

    if (!post) {
      throw new NotFoundException('Статья не найдена');
    }
    post.views++;
    return await this.postRepository.save(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne(id);

    if (!post) {
      throw new NotFoundException('Статья не найдена');
    }
    Object.assign(post, updatePostDto);
    return await this.postRepository.save(post);
  }

  async remove(id: number) {
    const post = await this.postRepository.findOne(id);

    if (!post) {
      throw new NotFoundException('Статья не найдена');
    }

    return await this.postRepository.delete(id);
  }
}
