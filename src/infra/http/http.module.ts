import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateQuestionsUseCase } from "src/domain/forum/application/use-cases/create-question";
import { FetchRecentQuestionUseCase } from "src/domain/forum/application/use-cases/fetch-recent-questions";
import { RegisterStudentsUseCase } from "src/domain/forum/application/use-cases/register-student";
import { AuthenticateStudentsUseCase } from "src/domain/forum/application/use-cases/authenticate-student";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { GetQuestionBySlugUseCase } from "src/domain/forum/application/use-cases/get-question-by-slug";
import { GetQuestionBySlugController } from "./controllers/get-question-by-slug.controller";
import { EditQuestionController } from "./controllers/edit-question.controller";
import { EditQuestionsUseCase } from "src/domain/forum/application/use-cases/edit-question";
import { DeleteQuestionController } from "./controllers/delete-question.controller";
import { DeleteQuestionsUseCase } from "src/domain/forum/application/use-cases/delete-question";
import { AnswerQuestionController } from "./controllers/answer-question.controller";
import { AnswerQuestionsUseCase } from "src/domain/forum/application/use-cases/answer-question";
import { EditAnswerController } from "./controllers/edit-answer.controller";
import { EditAnswersUseCase } from "src/domain/forum/application/use-cases/edit-answer";
import { DeleteAnswersUseCase } from "src/domain/forum/application/use-cases/delete-answer";
import { DeleteAnswerController } from "./controllers/delete-answer.controller";
import { FetchQuestionAnswersController } from "./controllers/fetch-question-answers.controller";
import { FetchQuestionAnswersUseCase } from "src/domain/forum/application/use-cases/fetch-question-answer";
import { ChooseQuestionBestAnswerController } from "./controllers/choose-question-best-answer.controller";
import { ChooseQuestionBestAnswersUseCase } from "src/domain/forum/application/use-cases/choose-question-best-answer";
import { CommentOnQuestionController } from "./controllers/comment-on-question.controller";
import { CommentOnQuestionsUseCase } from "src/domain/forum/application/use-cases/comment-on-question";
import { DeleteQuestionCommentController } from "./controllers/delete-question-comment.controller";
import { DeleteQuestionCommentsUseCase } from "src/domain/forum/application/use-cases/delete-question-comment";
import { CommentOnAnswerController } from "./controllers/comment-on-answer.controller";
import { CommentOnAnswersUseCase } from "src/domain/forum/application/use-cases/comment-on-answer";
import { DeleteAnswerCommentController } from "./controllers/delete-answer-comment.controller";
import { DeleteAnswerCommentsUseCase } from "src/domain/forum/application/use-cases/delete-answer-comment";
import { FetchQuestionCommentsController } from "./controllers/fetch-question-comments.controller";
import { FetchQuestionCommentsUseCase } from "src/domain/forum/application/use-cases/fetch-question-comments";
import { FetchAnswerCommentsController } from "./controllers/fetch-answer-comments.controller";
import { FetchAnswerCommentsUseCase } from "src/domain/forum/application/use-cases/fetch-answer-comments";
import { UploadAttachmentControler } from "./controllers/upload-attachement.controller";
import { UploadAndCreateAttachmentsUseCase } from "src/domain/forum/application/use-cases/uploadAndCreateAttachments";
import { StorageModule } from "../storage/storage.module";

@Module({
    imports: [DatabaseModule, CryptographyModule, StorageModule],
    controllers: [
        CreateAccountController, 
        AuthenticateController, 
        CreateQuestionController, 
        FetchRecentQuestionsController,
        GetQuestionBySlugController, 
        EditQuestionController,
        DeleteQuestionController,
        AnswerQuestionController,
        EditAnswerController,
        DeleteAnswerController,
        FetchQuestionAnswersController,
        ChooseQuestionBestAnswerController,
        CommentOnQuestionController, 
        DeleteQuestionCommentController,
        CommentOnAnswerController,
        DeleteAnswerCommentController,
        FetchQuestionCommentsController,
        FetchAnswerCommentsController,
        UploadAttachmentControler
    ],
    providers: [
        CreateQuestionsUseCase,
        FetchRecentQuestionUseCase,
        RegisterStudentsUseCase,
        AuthenticateStudentsUseCase,
        GetQuestionBySlugUseCase,
        EditQuestionsUseCase,
        DeleteQuestionsUseCase,
        AnswerQuestionsUseCase,
        EditAnswersUseCase,
        DeleteAnswersUseCase,
        FetchQuestionAnswersUseCase,
        ChooseQuestionBestAnswersUseCase,
        CommentOnQuestionsUseCase,
        DeleteQuestionCommentsUseCase,
        CommentOnAnswersUseCase,
        DeleteAnswerCommentsUseCase,
        FetchQuestionCommentsUseCase,
        FetchAnswerCommentsUseCase,
        UploadAndCreateAttachmentsUseCase
    ]
})
export class HttpModule{}