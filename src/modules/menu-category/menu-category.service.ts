import { MenuCategory } from '@core/database/entity/menuCategory.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MenuCategoryService {
  constructor(
    @InjectRepository(MenuCategory)
    private menuCategoryRepository: Repository<MenuCategory>,
  ) {}

  async getMenuCategoryById(id: number) {
    return await this.menuCategoryRepository.findOne({ where: { id } });
  }
}
