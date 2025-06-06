import { makeAnswer } from 'test/factories/make-answer'
import { EditAnswersUseCase } from './edit-answer'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { NotAllowedError } from 'src/core/errors/errors/not-allowed-error'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
//system under test
let sut: EditAnswersUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    sut = new EditAnswersUseCase(inMemoryAnswersRepository, inMemoryAnswerAttachmentsRepository)
  })
  it('should be able to edit a answer', async () => {

    const newAnswer = makeAnswer(
        {
            authorId: new UniqueEntityID('author-1')
        }, 
        new UniqueEntityID('answer-1'))

    inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1')
      })
    ),
    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2')
      })
    )
      
    await sut.execute({
        answerId: newAnswer.id.toValue(), 
        authorId: 'author-1',
        content: 'Conteudo teste',
        attachmentsIds: ['1','3']
    })

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
        content: 'Conteudo teste',
    })
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
      expect.objectContaining({attachmentId: new UniqueEntityID('3')})
    ])

  })

  it('should not be able to edit a answer from another user', async () => {

    const answer = makeAnswer({authorId: new UniqueEntityID('author-1')}, new UniqueEntityID('answer-1'))

    inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toValue(), 
      authorId: 'author-2',
      content: 'Conteudo teste',
      attachmentsIds: []
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)

  })

  it('should sync new and removed attchments when editing an answer', async () => {

    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1')
      }, 
      new UniqueEntityID('question-1')
    )

    await inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1')
      })
    ),
    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2')
      })
    )
      
    const result = await sut.execute({
        answerId: newAnswer.id.toValue(), 
        authorId: 'author-1',
        content: 'Conteudo teste',
        attachmentsIds: ['1', '3']
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
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

