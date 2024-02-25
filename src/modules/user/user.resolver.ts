import { GQLRoles } from '@core/decorator/GQLRoles.decorator';
import { GQLUserData } from '@core/decorator/gqlUser.decorator';
import { Public } from '@core/decorator/public.decorator';
import { ERole } from '@core/enum';
import { IUserData } from '@core/interface/default.interface';
import { UserService } from '@modules/user/user.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VSystemRegisterInput } from './dto/system-register.input';
import { UserRes } from './entities/userRes.entity';
import { VRestaurantAdminRegisterInput } from './dto/restaurant-admin-register.input';

@Resolver(() => UserRes)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserRes, { name: 'getUser' })
  @GQLRoles(Object.values(ERole))
  getUser(@GQLUserData() userData: IUserData) {
    return this.userService.getUser(userData);
  }

  @Public()
  @Mutation(() => UserRes, { name: 'systemRegister' })
  systemRegister(
    @Args('systemRegisterInput') systemRegister: VSystemRegisterInput,
  ) {
    return this.userService.systemRegister(systemRegister);
  }

  @GQLRoles([ERole.SYSTEM])
  @Mutation(() => UserRes, { name: 'restaurantAdminRegister' })
  restaurantAdminRegister(
    @GQLUserData() userData: IUserData,
    @Args('restaurantAdminRegisterInput')
    restaurantAdminRegister: VRestaurantAdminRegisterInput,
  ) {
    return this.userService.restaurantAdminRegister(
      userData,
      restaurantAdminRegister,
    );
  }
}
