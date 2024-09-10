import { GQLRoles } from '@core/decorator/GQLRoles.decorator';
import { GQLUserData } from '@core/decorator/gqlUser.decorator';
import { ERole } from '@core/enum';
import { CreateRes } from '@core/global/entities/createRes.entity';
import { IUserData } from '@core/interface/default.interface';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateOrderInput } from './dto/create-order.input';
import { OrderService } from './order.service';
import { UpdateRes } from '@core/global/entities/updateRes.entity';
import { UpdateOrderInput } from './dto/update-order.input';

@Resolver()
export class CreateOrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @GQLRoles([ERole.RESTAURANT_STAFF, ERole.RESTAURANT_ADMIN])
  @Mutation(() => CreateRes, { name: 'createOrder' })
  createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput) {
    return this.orderService.createOrder(createOrderInput);
  }

  @GQLRoles([ERole.RESTAURANT_STAFF, ERole.RESTAURANT_ADMIN])
  @Mutation(() => UpdateRes, { name: 'updateOrder' })
  updateOrder(
    @GQLUserData() userData: IUserData,
    @Args('updateOrderInput') updateOrderInput: UpdateOrderInput,
  ) {
    return this.orderService.updateOrder(userData, updateOrderInput);
  }
}
