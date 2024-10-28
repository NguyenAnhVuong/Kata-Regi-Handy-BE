import { Table } from '@core/database/entity/table.entity';
import { OrderModule } from '@modules/order/order.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableResolver } from './table.resolver';
import { TableService } from './table.service';

@Module({
  imports: [TypeOrmModule.forFeature([Table]), OrderModule],
  providers: [TableResolver, TableService],
  exports: [TableService],
})
export class TableModule {}
