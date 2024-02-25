import { Injectable } from '@nestjs/common';
import { CreateOrderItem } from './dto/create-order-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from '@core/database/entity/orderItem.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}
  async createOrderItems(
    orderId: number,
    createOrderItemInput: CreateOrderItem[],
    entityManager?: EntityManager,
  ) {
    const orderItemRepository = entityManager
      ? entityManager.getRepository(OrderItem)
      : this.orderItemRepository;
    return await orderItemRepository.save(
      createOrderItemInput.map((item) => ({ ...item, orderId })),
    );
  }
}
