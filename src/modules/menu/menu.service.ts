import { Menu } from '@core/database/entity/menu.entity';
import { IUserData } from '@core/interface/default.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { VCreateMenuInput } from './dto/create-menu.input';
import { VUpdateMenuInput } from './dto/update-menu.input';
//import { MenuCategoryService } from '@modules/menu-category/menu-category.service';
import { ErrorMessage } from '@core/enum';
import { RestaurantService } from '@modules/restaurant/restaurant.service';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly restaurantService: RestaurantService, //private readonly menuCategoryService: MenuCategoryService,
  ) {}

  async getMenuById(id: number, entityManager?: EntityManager) {
    const menuRepository = entityManager
      ? entityManager.getRepository(Menu)
      : this.menuRepository;

    return await menuRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
  }

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

    // const menuCategory = await this.menuCategoryService.getMenuCategoryById(
    //   createMenuInput.categoryId,
    // );

    // if (!menuCategory) {
    //   throw new HttpException(
    //     ErrorMessage.MENU_CATEGORY_NOT_EXISTS,
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    const newMenu: DeepPartial<Menu> = {
      name: createMenuInput.name,
      avatar: createMenuInput.avatar,
      description: createMenuInput.description,
      price: createMenuInput.price,
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
