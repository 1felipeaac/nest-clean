
import { FetchQuestionAnswersUseCase } from './fetch-question-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository
//system under test
let sut: FetchQuestionAnswersUseCase

describe('Fecth Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    await inMemoryAnswersRepository.create(makeAnswer({questionId: new UniqueEntityID('question-1')}))
    await inMemoryAnswersRepository.create(makeAnswer({questionId: new UniqueEntityID('question-1')}))
    await inMemoryAnswersRepository.create(makeAnswer({questionId: new UniqueEntityID('question-1')}))

    const result = await sut.execute({questionId: 'question-1',page: 1})

    expect(result.value?.answers).toHaveLength(3)
  })
  it('should be able to fetch recent question answers', async () => {
    for(let i = 1; i <= 22; i++){
      await inMemoryAnswersRepository.create(makeAnswer({questionId: new UniqueEntityID('question-1')}))

    }

    const result = await sut.execute({questionId: 'question-1', page: 2})

    expect(result.value?.answers).toHaveLength(2)
    
  })
})

