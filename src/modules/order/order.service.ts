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
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
    private readonly orderItemService: OrderItemService,
  ) {}
  async createOrder(createOrderInput: CreateOrderInput) {
    return await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        const { tableId, orderItems } = createOrderInput;
        const orderRepository = entityManager.getRepository(Order);
        const newOrder = await orderRepository.save({
          tableId,
        });
        await this.orderItemService.createOrderItems(
          newOrder.id,
          orderItems,
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
}
