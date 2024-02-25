import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class VCreateMenuInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  price: number;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  avatar?: string;

  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  categoryId: number;
}
