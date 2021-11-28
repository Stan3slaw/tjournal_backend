import { createParamDecorator } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

export const User = createParamDecorator(
  (data: string, ctx: any): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
