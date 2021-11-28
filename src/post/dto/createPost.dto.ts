import { IsArray, IsOptional, IsString } from 'class-validator';

export type BlockToolData<T extends object = any> = T;
export interface OutputBlockData<
  Type extends string = string,
  Data extends object = any,
> {
  id?: string;
  type: Type;
  data: BlockToolData<Data>;
}

export class CreatePostDto {
  @IsString()
  title: string;

  @IsArray()
  body: OutputBlockData[];

  @IsOptional()
  @IsArray()
  tags: string;
}
