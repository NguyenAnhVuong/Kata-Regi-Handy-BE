import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Menu } from './menu.entity';
import { Image } from './image.entity';
import { Table } from './table.entity';

@Entity('restaurants')
@ObjectType()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 200 })
  @Field(() => String)
  name: string;

  @Column({ name: 'address', type: 'varchar', length: 500 })
  @Field(() => String)
  address: string;

  @Column({ name: 'phone', type: 'varchar', length: 20 })
  @Field(() => String)
  phone: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  @Field(() => String)
  description: string | null;

  @Column({
    name: 'avatar',
    type: 'varchar',
    length: 250,
    default: process.env.APP_URL + '/restaurant-default.png',
  })
  @Field(() => String)
  avatar: string;

  @Column({ name: 'isDeleted', type: 'boolean', default: false })
  @Field(() => Boolean)
  isDeleted: boolean;

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

  @OneToMany(() => User, (user) => user.restaurant)
  @Field(() => [User])
  users: User[];

  @OneToMany(() => Menu, (menu) => menu.restaurant)
  @Field(() => [Menu])
  menus: Menu[];

  @OneToMany(() => Table, (table) => table.restaurant)
  @Field(() => [Table])
  tables: Table[];

  @OneToMany(() => Image, (image) => image.restaurant)
  @Field(() => [Image])
  images: Image[];

}
