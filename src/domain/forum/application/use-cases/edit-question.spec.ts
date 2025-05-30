import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionsUseCase } from './edit-question'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { NotAllowedError } from 'src/core/errors/errors/not-allowed-error'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
//system under test
let sut: EditQuestionsUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    sut = new EditQuestionsUseCase(inMemoryQuestionsRepository, inMemoryQuestionAttachmentsRepository)
  })
  it('should be able to edit a question', async () => {

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1')
      }, 
      new UniqueEntityID('question-1'))

    await inMemoryQuestionsRepository.create(newQuestion)

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
      
    await sut.execute({
        questionId: newQuestion.id.toValue(), 
        authorId: 'author-1',
        content: 'Conteudo teste',
        title: 'Pergunta teste',
        attachmentsIds: ['1', '3']
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
        content: 'Conteudo teste',
        title: 'Pergunta teste'
    })
    expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
      expect.objectContaining({attachmentId: new UniqueEntityID('3')})
    ])

  })

  it('should not be able to edit a question from another user', async () => {

    const question = makeQuestion({authorId: new UniqueEntityID('author-1')}, new UniqueEntityID('question-1'))

    inMemoryQuestionsRepository.create(question)

    const result = await sut.execute({
      questionId: question.id.toValue(), 
      authorId: 'author-2',
      content: 'Conteudo teste',
      title: 'Pergunta teste',
      attachmentsIds: []
    })
      
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)

  })

  it('should sync new and removed attchments when editing a question', async () => {

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1')
      }, 
      new UniqueEntityID('question-1')
    )

    await inMemoryQuestionsRepository.create(newQuestion)

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
      
    const result = await sut.execute({
        questionId: newQuestion.id.toValue(), 
        authorId: 'author-1',
        content: 'Conteudo teste',
        title: 'Pergunta teste',
        attachmentsIds: ['1', '3']
    })

    expect(result.isRight()).toBe(true)
    inMemoryQuestionAttachmentsRepository.items.map(item => console.log(item))
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1')
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('3')
        }),
      ])
    )
  })

})

