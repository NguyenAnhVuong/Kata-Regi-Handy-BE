import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Table } from './table.entity';

@Entity('tableGroups')
@ObjectType()
export class TableGroup {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ name: 'rootTableId', type: 'int' })
  @Field(() => Int)
  rootTableId: number;

  @Column({
    name: 'createdAt',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  createdAt: Date;

  @OneToMany(() => Table, (table) => table.group)
  @Field(() => [Table])
  tables: Table[];
}
