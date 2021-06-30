import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.find({ relations: ["games"], where: { id: user_id } });

    if (!user[0]) {
      throw new Error('User not found');
    }
    return user[0];
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query('SELECT * FROM users ORDER BY first_name ASC'); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return (
      this.repository
        .query(`SELECT * FROM users WHERE UPPER(first_name) = $1 AND UPPER(last_name) = $2`, [
          first_name.toUpperCase(),
          last_name.toUpperCase(),
        ]) // Complete usando raw query
    ) 
  }
}
