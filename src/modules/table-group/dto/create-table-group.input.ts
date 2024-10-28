import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateTableGroupInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  rootTableId: number;

  @Field(() => [Int])
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  tableIds: number[];
}
