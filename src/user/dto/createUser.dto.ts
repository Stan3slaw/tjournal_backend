import { IsEmail, Length } from 'class-validator';
// import { UniqueOnDatabase } from '../../auth/validators/UniqueValidator';
// import { UserEntity } from '../entities/user.entity';

export class CreateUserDto {
  @Length(3)
  readonly fullName: string;

  @IsEmail(undefined, { message: 'Неверная почта' })
  // @UniqueOnDatabase(UserEntity, {
  //   message: 'Такая почта уже есть',
  // })
  readonly email: string;

  @Length(6, 32, { message: 'Пароль должен быть минимум 6 символов' })
  readonly password?: string;
}
