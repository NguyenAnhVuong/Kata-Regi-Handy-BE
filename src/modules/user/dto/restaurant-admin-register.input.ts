import { EGender } from '@core/enum';
import { VCreateRestaurantInput } from '@modules/restaurant/dto/create-restaurant.input';
import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

@InputType()
export class VRestaurantAdminRegisterInput {
  @IsEmail()
  @IsNotEmpty()
  @Field(() => String)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  password: string;

  @Field(() => VCreateRestaurantInput)
  @ValidateNested()
  @Type(() => VCreateRestaurantInput)
  restaurant: VCreateRestaurantInput;
}
