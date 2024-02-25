import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { User } from './user.entity';
import { VocherItem } from './vocherItem.entity';

@Entity('vochers')
@ObjectType()
export class Vocher {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ name: 'code', type: 'varchar' })
  @Field(() => String)
  code: string;

  @Column({ name: 'discount', type: 'int' })
  @Min(0, { message: 'Discount percentage must be at least 0.' })
  @Max(100, { message: 'Discount percentage cannot exceed 100.' })
  @Field(() => Int)
  discountPercentage: number;

  @Column({ name: 'discountAmount', type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  @Min(0, { message: 'Discount amount must be at least 0.' })
  discountAmount: number;

  @Column({ name: 'maxDiscountAmount', type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  @Min(0, { message: 'Max of discount amount must be at least 0.' })
  maxDiscountAmount: number;

  @Column({ name: 'isUsed', type: 'boolean', default: false })
  @Field(() => Boolean)
  isUsed: boolean;

  @Column({ name: 'isDeleted', type: 'boolean', default: false })
  @Field(() => Boolean)
  isDeleted: boolean;

  @Column({ name: 'expiredAt', type: 'timestamp' })
  @Field(() => Date)
  expiredAt: Date;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  description: string;

  @Column({ name: 'restaurantId', type: 'int' })
  @Field(() => Int)
  restaurantId: number;

  @Column({ name: 'userId', type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  userId: number;

  @Column({ name: 'appliesToAll', type: 'boolean', default: false })
  @Field(() => Boolean)
  appliesToAll: boolean;

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

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.vochers)
  @JoinColumn({ name: 'restaurantId' })
  @Field(() => Restaurant)
  restaurant: Restaurant;

  @ManyToOne(() => User, (user) => user.vochers)
  @JoinColumn({ name: 'userId' })
  @Field(() => User, { nullable: true })
  user: User | null;

  @OneToMany(() => VocherItem, (vocherItem) => vocherItem.vocher)
  @Field(() => [VocherItem])
  vocherItems: VocherItem[];
}
