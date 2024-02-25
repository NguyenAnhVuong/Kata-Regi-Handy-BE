import { Menu } from '@core/database/entity/menu.entity';
import { GQLResponse } from '@core/global/entities/gqlRes.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MenusRes extends GQLResponse {
  @Field(() => [Menu])
  data: Menu[];
}
