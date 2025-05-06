import { Either, left, right } from "src/core/either";
import { AnswersRepository } from "src/domain/forum/application/repositories/answers-repository";
import { NotAllowedError } from "src/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "src/core/errors/errors/resource-not-found-error";

interface DeleteAnswersUseCaseRequest {
  authorId: string;
  answerId: string;
}

type DeleteAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteAnswersUseCase {
  constructor(private answerRepository: AnswersRepository) {}
  async execute({
    answerId,
    authorId
  }: DeleteAnswersUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError())
    }
    
    if(authorId !== answer.authorId.toString()){
        return left(new NotAllowedError())
    }

    await this.answerRepository.delete(answer);
    
    return right({ answer });
  }
}
