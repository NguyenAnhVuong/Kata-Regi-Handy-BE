import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class CreateOrderItem {
  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  orderId?: number;

  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  menuId: number;

  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  price: number;
}
