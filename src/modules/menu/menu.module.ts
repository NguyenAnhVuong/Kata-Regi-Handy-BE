import { Menu } from '@core/database/entity/menu.entity';
import { RestaurantModule } from '@modules/restaurant/restaurant.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuResolver } from './menu.resolver';
import { MenuService } from './menu.service';

@Module({
  imports: [TypeOrmModule.forFeature([Menu]), RestaurantModule],
  providers: [MenuResolver, MenuService],
  exports: [MenuService],
})
export class MenuModule {}
