import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderResolver } from './order.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@core/database/entity/order.entity';
import { OrderItemModule } from '@modules/order-item/order-item.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), OrderItemModule],
  providers: [CreateOrderResolver, OrderService],
})
export class OrderModule {}
