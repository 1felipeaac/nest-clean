import { Either, right } from 'src/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { Injectable } from '@nestjs/common'

interface FetchQuestionAnswersUseCaseRequest {
  questionId: string,
  page: number
}

type FetchQuestionAnswersUseCaseResponse = Either<null,{
    answers: Answer[]
}>

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private answerRepository: AnswersRepository) {}
  async execute({
    questionId,
    page
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answerRepository.findManyByQuestionId(questionId, {page})

    return right({answers})
  }
}
