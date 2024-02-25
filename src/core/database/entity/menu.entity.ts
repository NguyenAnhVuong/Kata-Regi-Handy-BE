import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MenuCategory } from './menuCategory.entity';
import { OrderItem } from './orderItem.entity';
import { Image } from './image.entity';
import { Restaurant } from './restaurant.entity';
import { VocherItem } from './vocherItem.entity';

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

  @Column({ name: 'categoryId', type: 'int' })
  @Field(() => Int)
  categoryId: number;

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

  @ManyToOne(() => MenuCategory, (menuCategory) => menuCategory.menus)
  @Field(() => MenuCategory)
  @JoinColumn({ name: 'categoryId' })
  menuCategory: MenuCategory;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.menu)
  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  @OneToMany(() => Image, (image) => image.menu)
  @Field(() => [Image])
  images: Image[];

  @OneToMany(() => VocherItem, (vocherItem) => vocherItem.menu)
  @Field(() => [VocherItem])
  vocherItems: VocherItem[];
}
