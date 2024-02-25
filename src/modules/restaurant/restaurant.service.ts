import { Restaurant } from '@core/database/entity/restaurant.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async getRestaurantById(id: number, entityManager?: EntityManager) {
    const restaurantRepository = entityManager
      ? entityManager.getRepository(Restaurant)
      : this.restaurantRepository;

    return await restaurantRepository.findOne({ where: { id } });
  }

  async createRestaurant(
    restaurant: DeepPartial<Restaurant>,
    entityManager?: EntityManager,
  ) {
    const restaurantRepository = entityManager
      ? entityManager.getRepository(Restaurant)
      : this.restaurantRepository;

    return await restaurantRepository.save(restaurant);
  }
}
