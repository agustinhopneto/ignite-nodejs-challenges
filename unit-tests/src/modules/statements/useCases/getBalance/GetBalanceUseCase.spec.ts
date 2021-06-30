import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe('Show Users Balance', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)
  })

  it('should be able to show users balance', async () => {
    const user = await usersRepository.create({
      name: 'User Test',
      email: 'user@test.com',
      password: 'test1234'
    })

    const balance = await getBalanceUseCase.execute({ user_id: user.id as string })

    expect(balance).toHaveProperty('balance')
  })

  it('should not be able to show a non existent users balance', async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: 'non-existent-user'})
    }).rejects.toBeInstanceOf(AppError)
  })
})
