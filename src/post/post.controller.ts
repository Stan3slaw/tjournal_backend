import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { SearchPostDto } from './dto/searchPost.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/decorators/user.decorator';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @User('id') currentUserId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postService.create(createPostDto, currentUserId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@User('id') currentUserId: number, @Param('id') id: string) {
    return this.postService.remove(+id, currentUserId);
  }

  @Get()
  async findAll() {
    return await this.postService.findAll();
  }

  @Get('popular')
  async findAllPopular() {
    return await this.postService.findAllPopular();
  }

  @Get('search')
  async searchPost(@Query() searchPostDto: SearchPostDto) {
    return await this.postService.searchPost(searchPostDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }
}
