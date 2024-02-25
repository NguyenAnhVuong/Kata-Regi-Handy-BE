import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ERole } from 'src/core/enum/default.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserDetail } from './userDetail.entity';
import { Restaurant } from './restaurant.entity';
import { Vocher } from './vocher.entity';

registerEnumType(ERole, {
  name: 'ERole',
});
@Entity('users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ name: 'restaurantId', type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  restaurantId: number | null;

  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  @Field(() => String)
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 100 })
  password: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: ERole,
    default: ERole.USER,
  })
  @Field(() => ERole, { defaultValue: ERole.USER })
  role: ERole;

  @Column({ name: 'refreshToken', type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  refreshToken: string | null;

  @Column({ name: 'userDetailId', type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  userDetailId: number | null;

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

  @OneToOne(() => UserDetail, (userDetail) => userDetail.user)
  @JoinColumn({ name: 'userDetailId' })
  @Field(() => UserDetail)
  userDetail: UserDetail;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.users)
  @JoinColumn({ name: 'restaurantId' })
  @Field(() => Restaurant)
  restaurant: Restaurant;

  @OneToMany(() => Vocher, (vocher) => vocher.user)
  @Field(() => [Vocher])
  vochers: Vocher[];
}
