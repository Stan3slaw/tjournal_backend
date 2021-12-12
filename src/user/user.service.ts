import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { SearchUserDto } from './dto/searchUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    return await this.usersRepository.save(createUserDto);
  }

  async findAll() {
    const arr = await this.usersRepository
      .createQueryBuilder('u')
      .leftJoinAndMapMany(
        'u.comments',
        CommentEntity,
        'comment',
        'comment.userId = u.id',
      )
      .loadRelationCountAndMap('u.commentsCount', 'u.comments', 'comments')
      .getMany();
    return arr.map(obj => {
      delete obj.comments;
      return obj;
    });
  }

  findById(id: number) {
    return this.usersRepository.findOne(id);
  }

  async findByCond(cond: LoginUserDto) {
    return await this.usersRepository.findOne(cond);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async search(searchUserDto: SearchUserDto) {
    const queryBuilder = this.usersRepository.createQueryBuilder('users');

    queryBuilder.limit(searchUserDto.limit || 10);
    queryBuilder.offset(searchUserDto.offset || 0);

    if (searchUserDto.email) {
      queryBuilder.andWhere('users.email LIKE :email', {
        email: `%${searchUserDto.email}%`,
      });
    }
    if (searchUserDto.fullName) {
      queryBuilder.andWhere('users.fullName LIKE :fullName', {
        fullName: `%${searchUserDto.fullName}%`,
      });
    }
    const [users, total] = await queryBuilder.getManyAndCount();
    return { users, total };
  }
}
