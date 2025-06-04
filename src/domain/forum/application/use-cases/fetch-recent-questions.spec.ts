
import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionUseCase } from './fetch-recent-questions'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
//system under test
let sut: FetchRecentQuestionUseCase

describe('Fecth Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository, 
      inMemoryAttachmentsRepository, 
      inMemoryStudentsRepository)
    sut = new FetchRecentQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionsRepository.create(makeQuestion({createdAt: new Date(2025, 3, 23)}))
    await inMemoryQuestionsRepository.create(makeQuestion({createdAt: new Date(2025, 3, 25)}))
    await inMemoryQuestionsRepository.create(makeQuestion({createdAt: new Date(2025, 3, 24)}))

    const result = await sut.execute({page: 1})

    expect(result.value?.questions).toEqual([
      expect.objectContaining({createdAt: new Date(2025, 3, 25)}),
      expect.objectContaining({createdAt: new Date(2025, 3, 24)}),
      expect.objectContaining({createdAt: new Date(2025, 3, 23)}),])


  })
  it('should be able to fetch recent paginated questions', async () => {
    for(let i = 1; i <= 22; i++){
      await inMemoryQuestionsRepository.create(makeQuestion())

    }

    const result = await sut.execute({page: 2})

    expect(result.value?.questions).toHaveLength(2)

  })
})

