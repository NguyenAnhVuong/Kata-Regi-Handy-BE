import { Table } from '@core/database/entity/table.entity';
import { GQLResponse } from '@core/global/entities/gqlRes.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UnpaidTableInfo extends Table {

  @Field(() => Number)
  total: number;
}

@ObjectType()
export class GetUnpaidTablesRes extends GQLResponse {
  @Field(() => [UnpaidTableInfo])
  data: UnpaidTableInfo[];
}
