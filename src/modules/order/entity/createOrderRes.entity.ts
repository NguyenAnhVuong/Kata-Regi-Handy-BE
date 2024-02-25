import { Order } from '@core/database/entity/order.entity';
import { GQLResponse } from '@core/global/entities/gqlRes.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateOrderRes extends GQLResponse {
  @Field(() => Order)
  data: Order;
}
