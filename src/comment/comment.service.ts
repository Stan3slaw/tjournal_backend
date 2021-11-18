import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}
  async create(createCommentDto: CreateCommentDto) {
    return await this.commentRepository.save({
      text: createCommentDto.text,
      post: { id: createCommentDto.postId },
      user: { id: 1 },
    });
  }

  async findAll() {
    return await this.commentRepository.find();
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
