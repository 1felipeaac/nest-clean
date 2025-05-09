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
import { GetQuestionbySlugController } from "./controllers/get-question-by-slug.controller";
import { EditQuestionController } from "./controllers/edit-question.controller";
import { EditQuestionsUseCase } from "src/domain/forum/application/use-cases/edit-question";
import { DeleteQuestionController } from "./controllers/delete-question.controller";
import { DeleteQuestionsUseCase } from "src/domain/forum/application/use-cases/delete-question";

@Module({
    imports: [DatabaseModule, CryptographyModule],
    controllers: [
        CreateAccountController, 
        AuthenticateController, 
        CreateQuestionController, 
        FetchRecentQuestionsController,
        GetQuestionbySlugController, 
        EditQuestionController,
        DeleteQuestionController
    ],
    providers: [
        CreateQuestionsUseCase,
        FetchRecentQuestionUseCase,
        RegisterStudentsUseCase,
        AuthenticateStudentsUseCase,
        GetQuestionBySlugUseCase,
        EditQuestionsUseCase,
        DeleteQuestionsUseCase
    ]
})
export class HttpModule{}