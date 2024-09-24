import { EOrderStatus } from '@core/enum';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class UpdateOrderInput {
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  id: number;

  @IsEnum(EOrderStatus)
  @IsNotEmpty()
  @Field(() => EOrderStatus)
  status: EOrderStatus;

  // @IsNumber()
  // @IsNotEmpty()
  // @Field(() => Int)
  // deposit: number;
}
