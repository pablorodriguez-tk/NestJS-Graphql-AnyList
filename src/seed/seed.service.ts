import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from '../items/items.service';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) {
    this.isProd = this.configService.get('STATE') === 'prod';
  }
  async executeSeed(): Promise<boolean> {
    if (this.isProd) {
      throw new UnauthorizedException('No se puede ejecutar en produccion');
    }
    await this.deleteDatabase();
    const user = await this.loadUsers();
    await this.loadItems(user);
    return true;
  }

  async deleteDatabase(): Promise<boolean> {
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    return true;
  }

  async loadUsers(): Promise<User> {
    const users = [];
    for (const user of SEED_USERS) {
      const newUser = await this.usersService.create(user);
      users.push(newUser);
    }

    await this.usersRepository.save(users);
    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const itemsPromises = [];
    for (const item of SEED_ITEMS) {
      const newItem = this.itemsService.create(item, user);
      itemsPromises.push(newItem);
    }
    await Promise.all(itemsPromises);
  }
}
