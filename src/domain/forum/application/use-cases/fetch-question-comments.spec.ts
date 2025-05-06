import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { FetchQuestionCommentUseCase } from './fetch-question-comments'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
//system under test
let sut: FetchQuestionCommentUseCase

describe('Fecth Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    await inMemoryQuestionCommentsRepository.create(makeQuestionComment({questionId: new UniqueEntityID('question-1')}))
    await inMemoryQuestionCommentsRepository.create(makeQuestionComment({questionId: new UniqueEntityID('question-1')}))
    await inMemoryQuestionCommentsRepository.create(makeQuestionComment({questionId: new UniqueEntityID('question-1')}))

    const result = await sut.execute({questionId: 'question-1',page: 1})

    expect(result.value?.questionComments).toHaveLength(3)

  })
  it('should be able to fetch recent question comments', async () => {
    for(let i = 1; i <= 22; i++){
      await inMemoryQuestionCommentsRepository.create(makeQuestionComment({questionId: new UniqueEntityID('question-1')}))

    }

    const result = await sut.execute({questionId: 'question-1', page: 2})

    expect(result.value?.questionComments).toHaveLength(2)
  })
})

