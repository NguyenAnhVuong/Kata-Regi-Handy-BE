import { ETableStatus } from '@core/enum';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsDate } from 'class-validator';

@InputType()
export class UpdateTableInput {
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  tableId: number;

  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  amountOfPeople: number;

  @IsEnum(ETableStatus)
  @IsNotEmpty()
  @Field(() => ETableStatus)
  status: ETableStatus;

  // @IsDate()
  // @IsNotEmpty()
  // @Field(() => Date)
  // openAt: Date;
}
