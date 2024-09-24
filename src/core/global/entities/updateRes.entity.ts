import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GQLResponse } from './gqlRes.entity';

@ObjectType()
class AffectedResult {
  @Field(() => Int, {nullable: true})
  affected: number | null;
}

@ObjectType()
export class UpdateRes extends GQLResponse {
  @Field(() => AffectedResult, { nullable: true })
  data: AffectedResult | null;
}
