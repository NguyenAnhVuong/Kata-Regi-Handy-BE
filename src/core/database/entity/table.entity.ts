import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Restaurant } from './restaurant.entity';
import { ETableStatus } from '@core/enum';
import { Order } from './order.entity';

registerEnumType(ETableStatus, {
  name: 'ETableStatus',
});

@Entity('tables')
@ObjectType()
export class Table {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 20 })
  @Field(() => String)
  name: string;

  @Column({ name: 'restaurantId', type: 'int' })
  @Field(() => Int)
  restaurantId: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ETableStatus,
    default: ETableStatus.OPEN,
  })
  @Field(() => ETableStatus)
  status: ETableStatus;

  @Column({ name: 'amountOfPeople', type: 'int' })
  @Field(() => Int)
  amountOfPeople: number;

  @Column({
    name: 'openAt',
    type: 'timestamp',
    nullable: true
  })
  @Field(() => Date, {nullable: true})
  openAt: Date;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.tables)
  @Field(() => Restaurant)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @OneToMany(() => Order, (order) => order.table)
  @Field(() => [Order])
  orders: Order[];
}
