import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let usersRepository: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get Statement Operation', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository)
  })

  it('should be able to show a statement operation', async () => {
    const user = await usersRepository.create({
      name: 'User Test',
      email: 'user@test.com',
      password: 'passTest'
    })

    const statement = await statementsRepository.create({
      amount: 99,
      type: OperationType.DEPOSIT,
      description: 'Test',
      user_id: user.id as string
    })

    const getStatement = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    })

    expect(getStatement.id).toEqual(statement.id)
  })

  it('should not be able to show a statement operation of a non existent user', async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: 'User Test',
        email: 'user@test.com',
        password: 'passTest'
      })

      const statement = await statementsRepository.create({
        amount: 99,
        type: OperationType.DEPOSIT,
        description: 'Test',
        user_id: user.id as string
      })

      await getStatementOperationUseCase.execute({
        user_id: 'non-existent-user',
        statement_id: statement.id as string
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to show a non existent statement', async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: 'User Test',
        email: 'user@test.com',
        password: 'passTest'
      })

      const statement = await statementsRepository.create({
        amount: 99,
        type: OperationType.DEPOSIT,
        description: 'Test',
        user_id: user.id as string
      })

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: 'non-existent-statement'
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
