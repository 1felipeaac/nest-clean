import { DeleteQuestionCommentsUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { NotAllowedError } from 'src/core/errors/errors/not-allowed-error'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
//system under test
let sut: DeleteQuestionCommentsUseCase

describe('Delete question comment', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(inMemoryStudentsRepository)
    sut = new DeleteQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })
  it('should be able to delete a question comment', async () => {
      
    const questionComment = makeQuestionComment()

    await inMemoryQuestionCommentsRepository.create(questionComment)
  
    if (questionComment) {
      await sut.execute({
        questionCommentId: questionComment.id.toString(),
        authorId: questionComment.authorId.toString()
      })

      expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
    }
  })

  it('should not be able to delete a another user question comment', async () => {
      
    const questionComment = makeQuestionComment({authorId: new UniqueEntityID('author-1')})

    await inMemoryQuestionCommentsRepository.create(questionComment)
  
    if (questionComment) {

      const result = await sut.execute({
        questionCommentId: questionComment.id.toString(),
        authorId: 'author-2'
      })

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(NotAllowedError)
        
    }
  })

})
