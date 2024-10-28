import { forwardRef, Module } from '@nestjs/common';
import { TableGroupService } from './table-group.service';
import { TableGroupResolver } from './table-group.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableGroup } from '@core/database/entity/tableGroups.entity';
import { OrderModule } from '@modules/order/order.module';
import { TableModule } from '@modules/table/table.module';

@Module({
  imports: [TypeOrmModule.forFeature([TableGroup]),forwardRef(() => OrderModule),forwardRef(() => TableModule)],
  providers: [TableGroupResolver, TableGroupService],
  exports: [TableGroupService]
})
export class TableGroupModule {}
