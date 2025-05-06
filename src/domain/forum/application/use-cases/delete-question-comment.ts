import { Either, left, right } from "src/core/either";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import { ResourceNotFoundError } from "src/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "src/core/errors/errors/not-allowed-error";

interface DeleteQuestionCommentsUseCaseRequest {
  authorId: string;
  questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError,{}>

export class DeleteQuestionCommentsUseCase {
  constructor(private questionCommentRepository: QuestionCommentsRepository) {}
  async execute({
    questionCommentId,
    authorId
  }: DeleteQuestionCommentsUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment = await this.questionCommentRepository.findById(questionCommentId);

    if (!questionComment) {
      return left(new ResourceNotFoundError())
    }

    if(authorId !== questionComment.authorId.toString()){
      return left(new NotAllowedError())
    }

    await this.questionCommentRepository.delete(questionComment);

    return right({});
  }
}
