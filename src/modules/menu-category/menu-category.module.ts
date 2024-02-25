import { Module } from '@nestjs/common';
import { MenuCategoryService } from './menu-category.service';
import { MenuCategoryResolver } from './menu-category.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuCategory } from '@core/database/entity/menuCategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuCategory])],
  providers: [MenuCategoryResolver, MenuCategoryService],
  exports: [MenuCategoryService],
})
export class MenuCategoryModule {}
