import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

import { Restaurant } from './restaurant.entity';
import { ETableStatus } from '@core/enum';

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

  @Column({ name: 'amountOpPeople', type: 'int' })
  @Field(() => Int)
  amountOfPeople: number;

  @Column({
    name: 'openAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  openAt: Date;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.tables)
  @Field(() => Restaurant)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

}
