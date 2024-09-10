import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { Order } from '@core/database/entity/order.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { OrderItemService } from '@modules/order-item/order-item.service';
import { IUserData } from '@core/interface/default.interface';
import { UpdateOrderInput } from './dto/update-order.input';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderEpository: Repository<Order>,
    private readonly dataSource: DataSource,
    private readonly orderItemService: OrderItemService,
  ) {}
  async createOrder(userData: IUserData, createOrderInput: CreateOrderInput) {
    return await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        const orderRepository = entityManager.getRepository(Order);
        const newOrder = await orderRepository.save({
          tableId: 1,
          total: createOrderInput.total,
        });
        await this.orderItemService.createOrderItems(
          newOrder.id,
          createOrderInput.orderItems,
          entityManager,
        );
        return true;
      },
    );
  }

  async updateOrder(userData: IUserData, updateOrderInput: UpdateOrderInput) {
    const order = await this.orderEpository.findOne({
      where: {
        id: updateOrderInput.id,
        //restaurantId: userData.rid,
      },
    });

    if (!order) {
      return false;
    }

    return await this.orderEpository.update(
      { id: updateOrderInput.id },
      { status: updateOrderInput.status },
    );
  }
}
