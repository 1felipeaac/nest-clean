import { PaginationParams } from "src/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "src/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "src/domain/forum/enterprise/entities/answer-comment";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { CommentWithAuthor } from "src/domain/forum/enterprise/entities/value-objects/comment-with-author";

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository{
    public items: AnswerComment[] = []

    constructor(private studentRepository: InMemoryStudentsRepository){}
    async create(answer: AnswerComment){
        this.items.push(answer)
    }

    async findById(id: string) {
        const questionComment = this.items.find((item) => item.id.toString() === id);
    
        if (!questionComment) {
          return null;
        }
    
        return questionComment;
      }
    async delete(question: AnswerComment){
        const itemIndex = this.items.findIndex((item) => item.id === question.id);

        this.items.splice(itemIndex, 1);
    }

    async findManyByAnswerId(answerCommentId: string, params: PaginationParams): Promise<AnswerComment[]> {
        const questionComment = this.items.filter(item => item.answerId.toString() === answerCommentId)
      .slice((params.page - 1) * 20, params.page * 20)

    return questionComment
    }

    async findManyByAnswerIdWithAuthor(answerId: string, params: PaginationParams): Promise<CommentWithAuthor[]> {

      const answerComment = this.items.filter(item => item.answerId.toString() === answerId)
      .slice((params.page - 1) * 20, params.page * 20)
      .map(comment => {
        const author = this.studentRepository.items.find((student) => {
          return student.id.equals(comment.authorId)
        })
  
        if(!author){
          throw new Error(
            `Author with ID "${comment.authorId.toString()}" does not exists.`
          )
        }
        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name
        })
      })
  
      return answerComment
    }
}