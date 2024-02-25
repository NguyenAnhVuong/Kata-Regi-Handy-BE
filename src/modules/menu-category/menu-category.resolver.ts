import { Resolver } from '@nestjs/graphql';
import { MenuCategoryService } from './menu-category.service';

@Resolver()
export class MenuCategoryResolver {
  constructor(private readonly menuCategoryService: MenuCategoryService) {}
}
