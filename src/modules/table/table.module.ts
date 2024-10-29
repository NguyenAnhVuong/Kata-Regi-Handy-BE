import { Table } from '@core/database/entity/table.entity';
import { OrderModule } from '@modules/order/order.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableResolver } from './table.resolver';
import { TableService } from './table.service';
import { TableGroupModule } from '@modules/table-group/table-group.module';

@Module({
  imports: [TypeOrmModule.forFeature([Table]),forwardRef(() => OrderModule),forwardRef(() => TableGroupModule)],
  providers: [TableResolver, TableService],
  exports: [TableService],
})
export class TableModule {}
