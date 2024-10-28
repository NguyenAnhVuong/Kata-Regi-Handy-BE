import { Table } from '@core/database/entity/table.entity';
import { OrderService } from '@modules/order/order.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
// import { OrderItemService } from '@modules/order-item/order-item.service';
import { ErrorMessage, ETableStatus } from '@core/enum';
import { IUserData } from '@core/interface/default.interface';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdateTableInput } from './dto/update-table.input';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    private readonly dataSource: DataSource,
    private readonly orderService: OrderService, // private readonly orderItemService: OrderItemService,
  ) {}

  async getTables(userData: IUserData) {
    return await this.tableRepository
      .createQueryBuilder('table')
      .leftJoin('table.orders', 'order')
      .leftJoin('order.orderItems', 'orderItem')
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
      .groupBy('table.id')
      .orderBy('table.id')
      .getRawMany();
  }

  async getUnpaidTables(userData: IUserData) {
    return await this.tableRepository
      .createQueryBuilder('table')
      .leftJoin('table.orders', 'order')
      .leftJoin('order.orderItems', 'orderItem')
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
    return await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        const setTableOpen = await entityManager
          .getRepository(Table)
          .update(
            { id: createPaymentInput.tableId },
            { status: ETableStatus.OPEN, amountOfPeople: 0, openAt: null },
          );

        if ((setTableOpen.affected = 0)) {
          throw new HttpException(
            ErrorMessage.TABLE_DOES_NOT_EXISTS,
            HttpStatus.BAD_REQUEST,
          );
        }

        return await this.orderService.updateStatusMany(
          createPaymentInput.tableId,
          entityManager,
        );
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
    return await tableRepository.update(
      { id: In(tableIds) },
      { status: ETableStatus.GROUPED, groupId },
    );
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
}
