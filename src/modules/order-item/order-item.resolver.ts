import { Resolver } from '@nestjs/graphql';
import { OrderItemService } from './order-item.service';

@Resolver()
export class OrderItemResolver {
  constructor(private readonly orderItemService: OrderItemService) {}
}
