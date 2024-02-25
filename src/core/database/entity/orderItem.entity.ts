import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Menu } from './menu.entity';

@Entity('orderItems')
@ObjectType()
export class OrderItem {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ name: 'orderId', type: 'int' })
  @Field(() => Int)
  orderId: number;

  @Column({ name: 'menuId', type: 'int' })
  @Field(() => Int)
  menuId: number;

  @Column({ name: 'quantity', type: 'int' })
  @Field(() => Int)
  quantity: number;

  @Column({
    name: 'createdAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  createdAt: Date;

  @Column({
    name: 'updatedAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  updatedAt: Date;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @Field(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Menu, (menu) => menu.orderItems)
  @Field(() => Menu)
  @JoinColumn({ name: 'menuId' })
  menu: Menu;
}
