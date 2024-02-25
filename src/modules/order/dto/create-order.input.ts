import { CreateOrderItem } from '@modules/order-item/dto/create-order-item.input';
import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

@InputType()
export class CreateOrderInput {
  @IsArray()
  @Field(() => [CreateOrderItem])
  @ValidateNested()
  @Type(() => CreateOrderItem)
  orderItems: CreateOrderItem[];

  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  total: number;
}
