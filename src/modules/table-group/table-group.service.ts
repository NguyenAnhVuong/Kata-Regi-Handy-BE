import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTableGroupInput } from './dto/create-table-group.input';
import { OrderService } from '@modules/order/order.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TableGroup } from '@core/database/entity/tableGroups.entity';
import { DataSource, Repository } from 'typeorm';
import { TableService } from '@modules/table/table.service';
import { ErrorMessage } from '@core/enum';

@Injectable()
export class TableGroupService {
  constructor(
    @InjectRepository(TableGroup)
    private readonly tableGroupRepository: Repository<TableGroup>,
    private readonly orderService: OrderService,
    private readonly tableService: TableService,
    private readonly dataSource: DataSource,
  ) {}
  async createTableGroup(createTableGroupInput: CreateTableGroupInput) {
    const { rootTableId, tableIds } = createTableGroupInput;

    return this.dataSource.transaction(async (entityManager) => {
      const tableGroupRepository = entityManager.getRepository(TableGroup);

      await this.orderService.updateInCompleteOrderByTableIds(
        tableIds,
        rootTableId,
        entityManager,
      );

      const newTableGroup = await tableGroupRepository.save({
        rootTableId,
      });

      await this.tableService.updateGroupTableByTableIds(
        newTableGroup.id,
        [rootTableId, ...tableIds],
        entityManager,
      );

      return true;
    });
  }

  async deleteTableGroup(groupId: number) {
    return this.dataSource.transaction(async (entityManager) => {
      const tableGroupRepository = entityManager.getRepository(TableGroup);

      const tableGroup = await tableGroupRepository.findOne({
        where: { id: groupId },
      });

      if (!tableGroup) {
        throw new HttpException(
          ErrorMessage.TABLE_GROUP_DOES_NOT_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.tableService.deleteGroupTableByGroupId(
        groupId,
        tableGroup.rootTableId,
        entityManager,
      );

      await tableGroupRepository.delete(groupId);

      return true;
    });
  }
}
