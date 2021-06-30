import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let usersRepository: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Statement', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)
  })

  it('should be able to create a new statement', async () => {
    const user = await usersRepository.create({
      email: 'user@test.com',
      name: 'User Test',
      password: 'passTest'
    })

    const statement = await createStatementUseCase.execute({
      amount: 99,
      description: 'test',
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    })

    expect(statement).toHaveProperty('id')
  })

  it('should not be able to create a new statement to a non existent user', async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 99,
        description: 'test',
        type: OperationType.DEPOSIT,
        user_id: 'non-existent-user'
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to withdraw when funds is insuficient', async () => {
    expect(async () => {
      const user = await usersRepository.create({
        email: 'user@test.com',
        name: 'User Test',
        password: 'passTest'
      })

      await createStatementUseCase.execute({
        amount: 99,
        description: 'test',
        type: OperationType.WITHDRAW,
        user_id: user.id as string
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
