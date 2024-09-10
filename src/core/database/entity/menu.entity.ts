import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OrderItem } from './orderItem.entity';
import { Image } from './image.entity';
import { Restaurant } from './restaurant.entity';

@Entity('menus')
@ObjectType()
export class Menu {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 200 })
  @Field(() => String)
  name: string;

  @Column({ name: 'price', type: 'int' })
  @Field(() => Int)
  price: number;

  @Column({ name: 'description', type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  description: string | null;

  @Column({
    name: 'avatar',
    type: 'varchar',
    length: 250,
    default: process.env.APP_URL + '/menu-default.png',
  })
  @Field(() => String)
  avatar: string;

  @Column({ name: 'isDisplay', type: 'boolean', default: true })
  @Field(() => Boolean)
  isDisplay: boolean;

  @Column({ name: 'isDeleted', type: 'boolean', default: false })
  @Field(() => Boolean)
  isDeleted: boolean;

  @Column({ name: 'restaurantId', type: 'int' })
  @Field(() => Int)
  restaurantId: number;

  @Column({ name: 'creatorId', type: 'int' })
  @Field(() => Int)
  creatorId: number;

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

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus)
  @Field(() => Restaurant)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.menu)
  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  @OneToMany(() => Image, (image) => image.menu)
  @Field(() => [Image])
  images: Image[];
}
