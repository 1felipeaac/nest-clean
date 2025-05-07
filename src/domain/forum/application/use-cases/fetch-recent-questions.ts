import { QuestionsRepository } from 'src/domain/forum/application/repositories/questions-repository'
import { Question } from '../../enterprise/entities/question'
import { Either, right } from 'src/core/either'
import { Injectable } from '@nestjs/common'

interface FecthRecentQuestionUseCaseRequest {
  page: number
}

type FecthRecentQuestionUseCaseResponse = Either<null, {
    questions: Question[]
}>

@Injectable()
export class FetchRecentQuestionUseCase {
  constructor(private questionRepository: QuestionsRepository) {}
  async execute({
    page
  }: FecthRecentQuestionUseCaseRequest): Promise<FecthRecentQuestionUseCaseResponse> {
    const questions = await this.questionRepository.findManyRecent({page})

    return right({questions})
  }
}
