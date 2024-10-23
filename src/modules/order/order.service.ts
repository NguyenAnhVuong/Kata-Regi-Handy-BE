import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { Order } from '@core/database/entity/order.entity';
import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import { OrderItemService } from '@modules/order-item/order-item.service';
import { IUserData } from '@core/interface/default.interface';
import { UpdateOrderInput } from './dto/update-order.input';
import { MenuService } from '@modules/menu/menu.service';
import { ErrorMessage } from '@core/enum';
import { EOrderStatus } from '@core/enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
    private readonly orderItemService: OrderItemService,
    private readonly menuService: MenuService,
  ) {}
  async createOrder(createOrderInput: CreateOrderInput) {
    return await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        const { tableId, orderItems } = createOrderInput;
        const orderRepository = entityManager.getRepository(Order);
        const newOrder = await orderRepository.save({
          tableId,
        });

        const newOrderItems = await Promise.all(
          orderItems.map(async (orderItem) => {
            const menu = await this.menuService.getMenuById(
              orderItem.menuId,
              entityManager,
            );
            if (!menu) {
              throw new HttpException(
                ErrorMessage.MENU_NOT_EXIST,
                HttpStatus.BAD_REQUEST,
              );
            }
            return {
              ...orderItem,
              price: menu.price,
            };
          }),
        );

        await this.orderItemService.createOrderItems(
          newOrder.id,
          newOrderItems,
          entityManager,
        );
        return true;
      },
    );
  }

  async updateOrder(userData: IUserData, updateOrderInput: UpdateOrderInput) {
    const order = await this.orderRepository.findOne({
      where: {
        id: updateOrderInput.id,
        //restaurantId: userData.rid,
      },
    });

    if (!order) {
      return false;
    }

    return await this.orderRepository.update(
      { id: updateOrderInput.id },
      { status: updateOrderInput.status },
    );
  }

  async updateStatusMany(tableId: number, entityManager: EntityManager) {
    const listIds = await entityManager
      .getRepository(Order)
      .createQueryBuilder('order')
      .where('order.tableId = :tableId', { tableId })
      .andWhere('order.status != :status', { status: EOrderStatus.COMPLETED })
      .select('order.id')
      .getMany();

    return await entityManager
      .createQueryBuilder()
      .update(Order)
      .set({ status: EOrderStatus.COMPLETED })
      .whereInIds(listIds)
      .execute();
  }

  async updateInCompleteOrderByTableIds(
    tableIds: number[],
    newTableId: number,
    entityManager?: EntityManager,
  ) {
    const orderRepository = entityManager
      ? entityManager.getRepository(Order)
      : this.orderRepository;
    return await orderRepository.update(
      { tableId: In(tableIds), status: Not(EOrderStatus.COMPLETED) },
      { tableId: newTableId },
    );
  }
}
