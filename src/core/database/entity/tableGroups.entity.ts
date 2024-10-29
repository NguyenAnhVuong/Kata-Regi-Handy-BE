import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @OneToOne(() => Table, (table) => table.childGroup)
  @Field(() => Table)
  @JoinColumn({name: 'rootTableId'})
  rootTable: Table
}
