import { AnswersRepository } from "src/domain/forum/application/repositories/answers-repository";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { Either, left, right } from "src/core/either";
import { ResourceNotFoundError } from "src/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "src/core/errors/errors/not-allowed-error";

interface ChooseQusetBestAnswersUseCaseRequest {
  authorId: string;
  answerId: string;
}

type ChooseQusetBestAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
    question: Question
}>

export class ChooseQusetBestAnswersUseCase {
  constructor(private answerRepository: AnswersRepository, private questionRepository: QuestionsRepository) {}
  async execute({
    answerId,
    authorId,
  }: ChooseQusetBestAnswersUseCaseRequest): Promise<ChooseQusetBestAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);
    
    if (!answer) {
        return left(new ResourceNotFoundError())
    }

    const question = await this.questionRepository.findById(answer.questionId.toString());

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if(authorId !== question.authorId.toString()){
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.questionRepository.save(question);

    return right({ question });
  }
}
