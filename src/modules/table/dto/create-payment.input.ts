import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreatePaymentInput {
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  tableId: number;

}
