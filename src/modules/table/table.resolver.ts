import { GQLRoles } from '@core/decorator/GQLRoles.decorator';
import { GQLUserData } from '@core/decorator/gqlUser.decorator';
import { ERole } from '@core/enum';
import { CreateRes } from '@core/global/entities/createRes.entity';
import { IUserData } from '@core/interface/default.interface';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { TableService } from './table.service';
import { UpdateRes } from '@core/global/entities/updateRes.entity';
import { UpdateTableInput } from './dto/update-table.input';
import { GetTablesRes } from './entity/getTablesRes.entity';
import { GetUnpaidTablesRes } from './entity/getUnpaidTablesRes';
import { CreatePaymentInput } from '@modules/table/dto/create-payment.input';


@Resolver()
export class TableResolver {
  constructor(private readonly tableService: TableService) {}

  @GQLRoles([ERole.RESTAURANT_STAFF, ERole.RESTAURANT_ADMIN])
  @Query(() => GetTablesRes, { name: 'getTables' })
  getTables(
    @GQLUserData() userData: IUserData,
  ) {
    return this.tableService.getTables(userData);
  }

  @GQLRoles([ERole.RESTAURANT_STAFF, ERole.RESTAURANT_ADMIN])
  @Query(() => GetUnpaidTablesRes, { name: 'getUnpaidTables' })
  getUnpaidTables(
    @GQLUserData() userData: IUserData,
  ) {
    return this.tableService.getUnpaidTables(userData);
  }

  @GQLRoles([ERole.RESTAURANT_STAFF, ERole.RESTAURANT_ADMIN])
  @Mutation(() => UpdateRes, { name: 'updateTable' })
  updateTable(
    @GQLUserData() userData: IUserData,
    @Args('updateTableInput') updateTableInput: UpdateTableInput,
  ) {
    return this.tableService.updateTable(userData, updateTableInput);
  }

  @GQLRoles([ERole.RESTAURANT_STAFF, ERole.RESTAURANT_ADMIN])
  @Mutation(() => UpdateRes, { name: 'createPayment' })
  createPayment(
    @GQLUserData() userData: IUserData,
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
  ) {
    return this.tableService.createPayment(userData, createPaymentInput);
  }
}
