import { EOrderStatus } from '@core/enum';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './orderItem.entity';
import { Table } from './table.entity';

registerEnumType(EOrderStatus, {
  name: 'EOrderStatus',
});
@Entity('orders')
@ObjectType()
export class Order {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

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

  @Column({name: 'tableId', type: 'int'})
  @Field(()=>Int)
  tableId: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  @ManyToOne(() => Table, (table) => table.orders)
  @Field(() => Table)
  @JoinColumn({name: 'tableId'})
  table: Table;
  
}
