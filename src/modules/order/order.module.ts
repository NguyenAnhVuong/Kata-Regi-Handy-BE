import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderResolver } from './order.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@core/database/entity/order.entity';
import { OrderItemModule } from '@modules/order-item/order-item.module';
import { MenuModule } from '@modules/menu/menu.module';
import { TableModule } from '@modules/table/table.module';
import { TableGroupModule } from '@modules/table-group/table-group.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), OrderItemModule, MenuModule, forwardRef(()=>TableModule, ), forwardRef(()=>TableGroupModule)],
  providers: [CreateOrderResolver, OrderService],
  exports: [OrderService]
})
export class OrderModule {}
