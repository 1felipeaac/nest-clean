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

@Module({
    imports: [DatabaseModule, CryptographyModule],
    controllers: [
        CreateAccountController, 
        AuthenticateController, 
        CreateQuestionController, 
        FetchRecentQuestionsController
    ],
    providers: [
        CreateQuestionsUseCase,
        FetchRecentQuestionUseCase,
        RegisterStudentsUseCase,
        AuthenticateStudentsUseCase
    ]
})
export class HttpModule{}