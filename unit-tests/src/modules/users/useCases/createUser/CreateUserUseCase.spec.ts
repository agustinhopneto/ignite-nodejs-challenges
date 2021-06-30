import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  })

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      email: 'user@test.com',
      name: 'User Test',
      password: 'test1234'
    })

    expect(user).toHaveProperty('id');
  })

  it('should not be able to create a new user with an existent email', async () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: 'user@test.com',
        name: 'User Test',
        password: 'test1234'
      })

      await createUserUseCase.execute({
        email: 'user@test.com',
        name: 'User Test 2',
        password: 'test1234'
      })
    }).rejects.toBeInstanceOf(AppError)
  })
});
