import { Module } from "@nestjs/common";
import { OnAnswerCreated } from "src/domain/notification/application/subscribers/on-answer-created";
import { OnQuestionBestAnswerChose } from "src/domain/notification/application/subscribers/on-question-best-answer-chose";
import { SendNotificationsUseCase } from "src/domain/notification/application/use-cases/send-notification";
import { DatabaseModule } from "../database/database.module";

@Module({
    imports: [DatabaseModule],
    providers: [
        OnAnswerCreated,
        OnQuestionBestAnswerChose,
        SendNotificationsUseCase
    ]
})
export class EventsModule {}