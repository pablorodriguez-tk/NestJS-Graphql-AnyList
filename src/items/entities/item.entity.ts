import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  // @Field(() => Float)
  // @Column()
  // quantity: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  quantityUnits?: string;

  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('userId-index')
  @Field(() => User)
  user?: User;

  @OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })
  @Field(() => [ListItem])
  listItems: ListItem[];
}
