import { Table } from '@core/database/entity/table.entity';
import { GQLResponse } from '@core/global/entities/gqlRes.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TableInfo extends Table {

  @Field(() => Number)
  total: number;
  @Field(() => Number, {nullable: true})
  rootTableId: number;
  @Field(() => String, {nullable: true})
  rootTableName: string;
  
}

@ObjectType()
export class GetTablesRes extends GQLResponse {
  @Field(() => [TableInfo])
  data: TableInfo[];
}
