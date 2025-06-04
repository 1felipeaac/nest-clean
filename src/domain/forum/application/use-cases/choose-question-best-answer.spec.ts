import { UniqueEntityID } from "src/core/entities/unique-entity-id"
import { NotAllowedError } from "src/core/errors/errors/not-allowed-error"

import { ChooseQuestionBestAnswersUseCase } from "./choose-question-best-answer"
import { makeAnswer } from "test/factories/make-answer"
import { makeQuestion } from "test/factories/make-question"
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository"
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository"
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository"
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository"


let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
//system under test
let sut: ChooseQuestionBestAnswersUseCase

describe('Choose Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryAnswersAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository, 
      inMemoryStudentsRepository)
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)
    sut = new ChooseQuestionBestAnswersUseCase(inMemoryAnswersRepository, inMemoryQuestionsRepository)
  })
  it('should be able to choose the question best answer', async () => {

    const question = makeQuestion()
    const answer = makeAnswer({questionId: question.id})

    inMemoryAnswersRepository.create(answer)
    inMemoryQuestionsRepository.create(question)
      
    await sut.execute({answerId: answer.id.toString(), authorId: question.authorId.toString()})

    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id)

  })

  it('should not be able to choose another user question best answer', async () => {

    const question = makeQuestion({authorId: new UniqueEntityID('author-1')})
    const answer = makeAnswer({questionId: question.id})

    inMemoryAnswersRepository.create(answer)
    inMemoryQuestionsRepository.create(question)

    const result = await sut.execute({answerId: answer.id.toString(), authorId: 'author-2'})

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)

  })

})

