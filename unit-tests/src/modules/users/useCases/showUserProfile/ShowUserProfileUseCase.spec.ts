import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase

describe('Show User Profile', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository)
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it('should be able to show a user profile', async () => {
    const user = await createUserUseCase.execute({
      email: 'user@test.com',
      name: 'User Test',
      password: 'test1234'
    })

    const userProfile = await showUserProfileUseCase.execute(user.id as string)

    expect(userProfile.email).toEqual(user.email)
  })

  it('should be able to show a user profile', async () => {
    const user = await createUserUseCase.execute({
      email: 'user@test.com',
      name: 'User Test',
      password: 'test1234'
    })

    const userProfile = await showUserProfileUseCase.execute(user.id as string)

    expect(userProfile.email).toEqual(user.email)
  })

  it('should not be able to show a non existent user profile', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('unexistent-user-id')
    }).rejects.toBeInstanceOf(AppError)
  })
})
