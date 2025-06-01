import { PaginationParams } from "src/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "src/domain/forum/application/repositories/question-comments-repository";
import { StudentsRepository } from "src/domain/forum/application/repositories/students-repository";
import { QuestionComment } from "src/domain/forum/enterprise/entities/question-comment";
import { CommentWithAuthor } from "src/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository{
  public items: QuestionComment[] = []

  constructor(private studentRepository: InMemoryStudentsRepository){}
  async findManyByQuestionIdWithAuthor(questionId: string, params: PaginationParams): Promise<CommentWithAuthor[]> {

    const questionComment = this.items.filter(item => item.questionId.toString() === questionId)
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

    return questionComment
  }
  async findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]> {
      const questionComment = this.items.filter(item => item.questionId.toString() === questionId)
    .slice((params.page - 1) * 20, params.page * 20)

  return questionComment
  }
  async findById(id: string) {
      const questionComment = this.items.find((item) => item.id.toString() === id);
  
      if (!questionComment) {
        return null;
      }
  
      return questionComment;
    }
  async delete(question: QuestionComment){
      const itemIndex = this.items.findIndex((item) => item.id === question.id);

      this.items.splice(itemIndex, 1);
  }
  async create(question: QuestionComment){
      this.items.push(question)
  }
}