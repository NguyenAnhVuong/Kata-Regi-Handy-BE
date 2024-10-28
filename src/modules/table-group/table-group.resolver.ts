import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TableGroupService } from './table-group.service';
import { GQLRoles } from '@core/decorator/GQLRoles.decorator';
import { ERole } from '@core/enum';
import { CreateRes } from '@core/global/entities/createRes.entity';
import { CreateTableGroupInput } from './dto/create-table-group.input';
import { DeleteRes } from '@core/global/entities/deleteRest.entity';
import { DeleteTableGroupInput } from './dto/delete-table-group.input';

@Resolver()
export class TableGroupResolver {
  constructor(private readonly tableGroupService: TableGroupService) {}

  @GQLRoles([ERole.RESTAURANT_ADMIN, ERole.RESTAURANT_STAFF])
  @Mutation(() => CreateRes, { name: 'createTableGroup' })
  createTableGroup(
    @Args('createTableGroupInput') createTableGroupInput: CreateTableGroupInput,
  ) {
    return this.tableGroupService.createTableGroup(createTableGroupInput);
  }

  @GQLRoles([ERole.RESTAURANT_ADMIN, ERole.RESTAURANT_STAFF])
  @Mutation(() => DeleteRes, { name: 'deleteTableGroup' })
  deleteTableGroup(
    @Args('deleteTableGroupInput') deleteTableGroupInput: DeleteTableGroupInput,
  ) {
    return this.tableGroupService.deleteTableGroup(
      deleteTableGroupInput.groupId,
    );
  }
}
