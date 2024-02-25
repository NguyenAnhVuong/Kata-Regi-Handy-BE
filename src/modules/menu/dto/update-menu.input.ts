import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class VUpdateMenuInput {
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  id: number;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  price?: number;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  avatar?: string;

  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  categoryId?: number;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  isDisplay?: boolean;
}
