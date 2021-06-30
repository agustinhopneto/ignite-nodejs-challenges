import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
  })

  it('should be able to authenticate an user', async () => {
    const user = {
      name: 'User Test',
      email: 'user@test.com',
      password: 'user123'
    }

    await createUserUseCase.execute(user)


    const auth = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })


    expect(auth).toHaveProperty('token')
  });

  it('should not be able to authenticate an user with an unexistent email', async () => {
    expect(async () => {
      const user = {
        name: 'User Test',
        email: 'user@test.com',
        password: 'user123'
      }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: 'email@test.com',
        password: user.password
      })
    }).rejects.toBeInstanceOf(AppError)
  });

  it('should not be able to authenticate an user with wrong password', async () => {
    expect(async () => {
      const user = {
        name: 'User Test',
        email: 'user@test.com',
        password: 'user123'
      }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'wrongPassword'
      })
    }).rejects.toBeInstanceOf(AppError)
  });
});
