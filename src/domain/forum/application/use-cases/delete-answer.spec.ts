import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { DeleteAnswersUseCase } from './delete-answer'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { NotAllowedError } from 'src/core/errors/errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository
//system under test
let sut: DeleteAnswersUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)
    sut = new DeleteAnswersUseCase(inMemoryAnswersRepository)
  })
  it('should be able to delete a answer', async () => {

    const newAnswer = makeAnswer({authorId: new UniqueEntityID('author-1')}, new UniqueEntityID('answer-1'))

    inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswersAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1')
      })
    ),
    inMemoryAnswersAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2')
      })
    )
      
    await sut.execute({answerId: 'answer-1', authorId: 'author-1'})

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
    expect(inMemoryAnswersAttachmentsRepository.items).toHaveLength(0)

  })

  it('should not be able to delete a answer from another user', async () => {

    const answer = makeAnswer({authorId: new UniqueEntityID('author-1')}, new UniqueEntityID('answer-1'))

    inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      answerId: 'answer-1', authorId: 'author-2'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
      
  })

})

