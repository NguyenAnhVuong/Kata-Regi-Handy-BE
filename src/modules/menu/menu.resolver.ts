import { GQLRoles } from '@core/decorator/GQLRoles.decorator';
import { GQLUserData } from '@core/decorator/gqlUser.decorator';
import { ERole } from '@core/enum';
import { UpdateRes } from '@core/global/entities/updateRes.entity';
import { IUserData } from '@core/interface/default.interface';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { VCreateMenuInput } from './dto/create-menu.input';
import { VUpdateMenuInput } from './dto/update-menu.input';
import { MenuRes } from './entity/menuRes.entity';
import { MenuService } from './menu.service';

@Resolver()
export class MenuResolver {
  constructor(private readonly menuService: MenuService) {}

  @GQLRoles([ERole.RESTAURANT_ADMIN, ERole.RESTAURANT_STAFF])
  @Mutation(() => MenuRes, { name: 'createMenu' })
  createMenu(
    @GQLUserData() userData: IUserData,
    @Args('createMenuInput') createMenuInput: VCreateMenuInput,
  ) {
    return this.menuService.createMenu(userData, createMenuInput);
  }

  @GQLRoles([ERole.RESTAURANT_ADMIN, ERole.RESTAURANT_STAFF])
  @Mutation(() => UpdateRes, { name: 'updateMenu' })
  updateMenu(@Args('updateMenuInput') updateMenuInput: VUpdateMenuInput) {
    return this.menuService.updateMenu(updateMenuInput);
  }

  @GQLRoles([ERole.RESTAURANT_ADMIN, ERole.RESTAURANT_STAFF])
  @Mutation(() => UpdateRes, { name: 'deleteMenu' })
  deleteMenu(@Args('id', { type: () => Int }) id: number) {
    return this.menuService.deleteMenuById(id);
  }
}
