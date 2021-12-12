import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}
  async create(createCommentDto: CreateCommentDto, currentUserId: number) {
    const comment = await this.commentRepository.save({
      text: createCommentDto.text,
      post: { id: createCommentDto.postId },
      user: { id: currentUserId },
    });
    return this.commentRepository.findOne(
      { id: comment.id },
      { relations: ['user'] },
    );
  }

  async findAll(postId: number) {
    const comments = await this.commentRepository.find({
      [postId ? 'where' : '']: {
        post: { id: postId },
      },
      relations: ['user', 'post'],
    });
    return comments.map(obj => ({
      ...obj,
      post: { id: obj.post.id, title: obj.post.title },
    }));
  }

  async findOne(id: number) {
    return await this.commentRepository.findOne(id);
  }

  async update(id: number, createCommentDto: UpdateCommentDto) {
    const comment = await this.commentRepository.findOne(id);
    Object.assign(comment, createCommentDto);
    return await this.commentRepository.save(comment);
  }

  async remove(id: number) {
    return await this.commentRepository.delete(id);
  }
}
