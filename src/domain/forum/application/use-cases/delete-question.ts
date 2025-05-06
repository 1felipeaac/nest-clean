import { QuestionsRepository } from "src/domain/forum/application/repositories/questions-repository";
import { ResourceNotFoundError } from "src/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "src/core/errors/errors/not-allowed-error";
import { Either, left, right } from "src/core/either";

interface DeleteQuestionsUseCaseRequest {
  authorId: string;
  questionId: string;
}

type DeleteQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteQuestionsUseCase {
  constructor(private questionRepository: QuestionsRepository) {}
  async execute({
    questionId,
    authorId
  }: DeleteQuestionsUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if(authorId !== question.authorId.toString()){
        return left(new NotAllowedError())
    }

    await this.questionRepository.delete(question);

    return right({ question });
  }
}
