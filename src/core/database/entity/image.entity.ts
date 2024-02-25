import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Restaurant } from './restaurant.entity';
import { Menu } from './menu.entity';

@Entity('images')
@ObjectType()
export class Image {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ name: 'restaurantId', type: 'int', nullable: true })
  @Field(() => Int)
  restaurantId: number | null;

  @Column({ name: 'menuId', type: 'int', nullable: true })
  @Field(() => Int)
  menuId: number | null;

  @Column({ name: 'url', type: 'varchar', length: 255 })
  @Field(() => String)
  url: string;

  @Column({ name: 'isDeleted', type: 'boolean', default: false })
  @Field(() => Boolean)
  isDeleted: boolean;

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

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.images)
  @JoinColumn({ name: 'restaurantId' })
  @Field(() => Restaurant)
  restaurant: Restaurant;

  @ManyToOne(() => Menu, (menu) => menu.images)
  @JoinColumn({ name: 'menuId' })
  @Field(() => Menu)
  menu: Menu;
}
