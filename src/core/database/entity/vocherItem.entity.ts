import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vocher } from './vocher.entity';
import { Menu } from './menu.entity';

@Entity('vocherItems')
@ObjectType()
export class VocherItem {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ name: 'vocherId', type: 'int' })
  @Field(() => Int)
  vocherId: number;

  @Column({ name: 'menuId', type: 'int' })
  @Field(() => Int)
  menuId: number;

  @Column({ name: 'maxQuantity', type: 'int', nullable: true })
  @Field(() => Int)
  maxQuantity: number | null;

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

  @ManyToOne(() => Vocher, (vocher) => vocher.vocherItems)
  @JoinColumn({ name: 'vocherId' })
  @Field(() => Vocher)
  vocher: Vocher;

  @ManyToOne(() => Menu, (menu) => menu.vocherItems)
  @JoinColumn({ name: 'menuId' })
  @Field(() => Menu)
  menu: Menu;
}
