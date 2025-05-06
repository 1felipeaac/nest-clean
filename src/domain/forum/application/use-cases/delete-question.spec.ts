
import { makeQuestion } from 'test/factories/make-question'
import { DeleteQuestionsUseCase } from './delete-question'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { NotAllowedError } from 'src/core/errors/errors/not-allowed-error'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
//system under test
let sut: DeleteQuestionsUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    sut = new DeleteQuestionsUseCase(inMemoryQuestionsRepository)
  })
  it('should be able to delete a question', async () => {

    const newQuestion = makeQuestion({authorId: new UniqueEntityID('author-1')}, new UniqueEntityID('question-1'))

    inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1')
      })
    ),
    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2')
      })
    )
      
    await sut.execute({questionId: 'question-1', authorId: 'author-1'})

    expect(inMemoryQuestionsRepository.items).toHaveLength(0)
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)

  })

  it('should not be able to delete a question from another user', async () => {

    const newQuestion = makeQuestion({authorId: new UniqueEntityID('author-1')}, new UniqueEntityID('question-1'))

    inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: 'question-1', authorId: 'author-2'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
      
  })

})

