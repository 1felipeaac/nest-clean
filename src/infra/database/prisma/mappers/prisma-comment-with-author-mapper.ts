import { CommentWithAuthor } from "src/domain/forum/enterprise/entities/value-objects/comment-with-author";

type PrismaComme

export class PrismaCommentWithAuthor {
    static toDomain(raw: any):CommentWithAuthor{
        return CommentWithAuthor.create({
            //...
        })
    }
}