import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableResolver } from './table.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from '@core/database/entity/table.entity';
import { OrderItemModule } from '@modules/order-item/order-item.module';
import { OrderModule } from '@modules/order/order.module';
import { Order } from '@core/database/entity/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Table]), OrderModule],
  providers: [TableResolver, TableService]
})
export class TableModule {}
