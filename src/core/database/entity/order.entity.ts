import { EOrderStatus } from '@core/enum';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './orderItem.entity';

registerEnumType(EOrderStatus, {
  name: 'EOrderStatus',
});
@Entity('orders')
@ObjectType()
export class Order {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ name: 'creatorId', type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  creatorId: number | null;

  @Column({ name: 'restaurantId', type: 'int' })
  @Field(() => Int)
  restaurantId: number;

  @Column({ name: 'isDeleted', type: 'boolean', default: false })
  @Field(() => Boolean)
  isDeleted: boolean;

  @Column({
    name: 'status',
    type: 'enum',
    enum: EOrderStatus,
    default: EOrderStatus.PENDING,
  })
  @Field(() => EOrderStatus)
  status: EOrderStatus;

  @Column({ name: 'total', type: 'int' })
  @Field(() => Int)
  total: number;

  @Column({ name: 'deposit', type: 'int', nullable: true })
  @Field(() => Int)
  deposit: number;

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

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  @Field(() => [OrderItem])
  orderItems: OrderItem[];
}
