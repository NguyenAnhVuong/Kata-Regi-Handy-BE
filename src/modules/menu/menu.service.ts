import { Menu } from '@core/database/entity/menu.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { VCreateMenuInput } from './dto/create-menu.input';
import { IUserData } from '@core/interface/default.interface';
import { VUpdateMenuInput } from './dto/update-menu.input';
import { UserService } from '@modules/user/user.service';
import { MenuCategoryService } from '@modules/menu-category/menu-category.service';
import { RestaurantService } from '@modules/restaurant/restaurant.service';
import { ErrorMessage } from '@core/enum';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly restaurantService: RestaurantService,
    private readonly menuCategoryService: MenuCategoryService,
  ) {}

  async createMenu(userData: IUserData, createMenuInput: VCreateMenuInput) {
    const restaurant = await this.restaurantService.getRestaurantById(
      userData.rid,
    );

    if (!restaurant) {
      throw new HttpException(
        ErrorMessage.RESTAURANT_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const menuCategory = await this.menuCategoryService.getMenuCategoryById(
      createMenuInput.categoryId,
    );

    if (!menuCategory) {
      throw new HttpException(
        ErrorMessage.MENU_CATEGORY_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newMenu: DeepPartial<Menu> = {
      name: createMenuInput.name,
      avatar: createMenuInput.avatar,
      description: createMenuInput.description,
      price: createMenuInput.price,
      categoryId: createMenuInput.categoryId,
      restaurantId: userData.rid,
      creatorId: userData.uid,
    };

    return await this.menuRepository.save(newMenu);
  }

  async updateMenu(updateMenuInput: VUpdateMenuInput) {
    return await this.menuRepository.update(
      updateMenuInput.id,
      updateMenuInput,
    );
  }

  async deleteMenuById(id: number) {
    return await this.menuRepository.update(id, { isDeleted: true });
  }
}
