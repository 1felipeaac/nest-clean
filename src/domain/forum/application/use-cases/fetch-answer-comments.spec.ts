import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { FetchAnswerCommentUseCase } from './fetch-answer-comments'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
//system under test
let sut: FetchAnswerCommentUseCase

describe('Fecth Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    await inMemoryAnswerCommentsRepository.create(makeAnswerComment({answerId: new UniqueEntityID('answer-1')}))
    await inMemoryAnswerCommentsRepository.create(makeAnswerComment({answerId: new UniqueEntityID('answer-1')}))
    await inMemoryAnswerCommentsRepository.create(makeAnswerComment({answerId: new UniqueEntityID('answer-1')}))

    const result = await sut.execute({answerId: 'answer-1',page: 1})
    expect(result.value?.answerComments).toHaveLength(3)

    // if(value){
    //   expect(value.answerComments).toHaveLength(3)
    // }

  })
  it('should be able to fetch recent answer comments', async () => {
    for(let i = 1; i <= 22; i++){
      await inMemoryAnswerCommentsRepository.create(makeAnswerComment({answerId: new UniqueEntityID('answer-1')}))

    }

    const result = await sut.execute({answerId: 'answer-1', page: 2})

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(2)

  })
})

