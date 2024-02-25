import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuResolver } from './menu.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from '@core/database/entity/menu.entity';
import { RestaurantModule } from '@modules/restaurant/restaurant.module';
import { UserModule } from '@modules/user/user.module';
import { MenuCategoryModule } from '@modules/menu-category/menu-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu]),
    RestaurantModule,
    MenuCategoryModule,
  ],
  providers: [MenuResolver, MenuService],
})
export class MenuModule {}
