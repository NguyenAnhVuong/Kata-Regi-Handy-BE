import { Table } from '@core/database/entity/table.entity';
import { OrderService } from '@modules/order/order.service';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
// import { OrderItemService } from '@modules/order-item/order-item.service';
import { ErrorMessage, ETableStatus } from '@core/enum';
import { IUserData } from '@core/interface/default.interface';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdateTableInput } from './dto/update-table.input';
import { TableGroupService } from '@modules/table-group/table-group.service';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService, // private readonly orderItemService: OrderItemService,
    @Inject(forwardRef(() => TableGroupService))
    private readonly tableGroupService: TableGroupService,
  ) {}

  async getTables(userData: IUserData) {
    const result = await this.tableRepository
      .createQueryBuilder('table')
      .leftJoin('table.group', 'group')
      .leftJoin('group.rootTable', 'rootTable')
      .leftJoin('table.orders', 'order')
      .leftJoin('order.orderItems', 'orderItem')
      .select('table.id', 'id')
      .addSelect('table.name', 'name')
      .addSelect('table.restaurantId', 'restaurantId')
      .addSelect('table.status', 'status')
      .addSelect('table.amountOfPeople', 'amountOfPeople')
      .addSelect('table.openAt', 'openAt')
      .addSelect('table.groupId', 'groupId')
      .addSelect('group.rootTableId', 'rootTableId')
      .addSelect('rootTable.name', 'rootTableName')
      .addSelect(
        "COALESCE(SUM(CASE WHEN order.status != 'COMPLETED' THEN orderItem.price * orderItem.quantity ELSE 0 END), 0)",
        'total',
      )
      .groupBy('table.id')
      .addGroupBy('group.id')
      .addGroupBy('rootTable.name')
      .orderBy('table.id')
      .getRawMany();

    return result;
  }

  async getUnpaidTables(userData: IUserData) {
    return await this.tableRepository
      .createQueryBuilder('table')
      .leftJoin('table.orders', 'order')
      .leftJoin('order.orderItems', 'orderItem')
      .leftJoin('table.group', 'group')
      .select('table.id', 'id')
      .addSelect('table.name', 'name')
      .addSelect('table.restaurantId', 'restaurantId')
      .addSelect('table.status', 'status')
      .addSelect('table.amountOfPeople', 'amountOfPeople')
      .addSelect('table.openAt', 'openAt')
      .addSelect(
        "COALESCE(SUM(CASE WHEN order.status != 'COMPLETED' THEN orderItem.price * orderItem.quantity ELSE 0 END), 0)",
        'total',
      )
      .where('table.status = :inuseStatus', { inuseStatus: ETableStatus.INUSE })
      .orWhere(
        'table.status = :groupedStatus AND table.id = group.rootTableId',
        { groupedStatus: ETableStatus.GROUPED },
      )
      .groupBy('table.id')
      .orderBy('table.id')
      .getRawMany();
  }

  async updateTable(userData: IUserData, updateTableInput: UpdateTableInput) {
    const table = await this.tableRepository.findOne({
      where: {
        id: updateTableInput.tableId,
      },
    });

    if (!table) {
      throw new HttpException(
        ErrorMessage.TABLE_DOES_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (updateTableInput.status === ETableStatus.INUSE) {
      return await this.tableRepository.update(
        { id: updateTableInput.tableId },
        {
          status: updateTableInput.status,
          amountOfPeople: updateTableInput.amountOfPeople,
          openAt: new Date().toISOString(),
        },
      );
    } else {
      return await this.tableRepository.update(
        { id: updateTableInput.tableId },
        {
          status: updateTableInput.status,
          amountOfPeople: updateTableInput.amountOfPeople,
          openAt: null,
        },
      );
    }
  }

  async createPayment(
    userData: IUserData,
    createPaymentInput: CreatePaymentInput,
  ) {
    const { tableId } = createPaymentInput;
    //find groupId
    const currentTable = await this.tableRepository.findOne({
      where: { id: tableId },
      select: ['groupId'],
    });
    const groupId = currentTable ? currentTable.groupId : null;

    return await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        //update table / root table
        const setTableOpen = await entityManager.getRepository(Table).update(
          { id: tableId },
          {
            status: ETableStatus.OPEN,
            amountOfPeople: 0,
            openAt: null,
            groupId: null,
          },
        );

        if (setTableOpen.affected == 0) {
          throw new HttpException(
            ErrorMessage.TABLE_DOES_NOT_EXISTS,
            HttpStatus.BAD_REQUEST,
          );
        }
        //set all table with same groupId to open and delete groupId, tableGroup
        if (groupId) {
          await entityManager.getRepository(Table).update(
            { id: Not(tableId), groupId },
            {
              groupId: null,
              status: ETableStatus.OPEN,
              amountOfPeople: 0,
              openAt: null,
            },
          );
          await this.tableGroupService.deleteTableGroupById(
            groupId,
            entityManager,
          );
        }

        //update order status to complete
        return await this.orderService.updateStatusMany(tableId, entityManager);
      },
    );
  }

  async updateGroupTableByTableIds(
    groupId: number,
    tableIds: number[],
    entityManager?: EntityManager,
  ) {
    const tableRepository = entityManager
      ? entityManager.getRepository(Table)
      : this.tableRepository;
    const { affected } = await tableRepository.update(
      { id: In(tableIds) },
      { status: ETableStatus.GROUPED, groupId },
    );
    if (affected !== tableIds.length) {
      throw new HttpException(
        ErrorMessage.TABLE_DOES_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteGroupTableByGroupId(
    groupId: number,
    rootTableId: number,
    entityManager?: EntityManager,
  ) {
    const tableRepository = entityManager
      ? entityManager.getRepository(Table)
      : this.tableRepository;
    await tableRepository.update(
      { id: rootTableId, groupId },
      { status: ETableStatus.INUSE, groupId: null },
    );

    return await tableRepository.update(
      { id: Not(rootTableId), groupId },
      { status: ETableStatus.OPEN, groupId: null, amountOfPeople: 0 },
    );
  }

  async findRootTableId(tableId: number) {
    const thisTable = await this.tableRepository.findOne({
      where: { id: tableId },
      relations: ['group'],
    });
    if (!thisTable)
      throw new HttpException(
        ErrorMessage.TABLE_DOES_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    if (thisTable.status === ETableStatus.GROUPED && thisTable.groupId)
      return thisTable.group.rootTableId;
    return tableId;
  }

  async getTableById(tableId: number, entityManager?: EntityManager) {
    const tableRepository = entityManager
      ? entityManager.getRepository(Table)
      : this.tableRepository;
    return await tableRepository.findOne({ where: { id: tableId } });
  }
}
