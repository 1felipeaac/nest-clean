import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { AnswerQuestionsUseCase } from './answer-question'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: AnswerQuestionsUseCase

describe('Create Answer', () => {

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    sut = new AnswerQuestionsUseCase(inMemoryAnswersRepository)
  })
  it('should be able to create a answer', async () => {
  
    const result = await sut.execute({
      questionId: '1',
      authorId: '1',
      content: 'Nova resposta',
      attachmentsIds: ['1', '2']
    })

    
   
    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer)
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
      expect.objectContaining({attachmentId: new UniqueEntityID('2')})
    ])
    
  })

  it('should persist attachments when creating a new answer', async () => {
      
    const result = await sut.execute({
      authorId: '1',
      questionId: '1',
      content: 'Conteudo da resposta',
      attachmentsIds: ['1', '2']
    })
  
    expect(result.isRight()).toBe(true)
    
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1')
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('2')
        }),
      ])
    )
    
  })
})
  
