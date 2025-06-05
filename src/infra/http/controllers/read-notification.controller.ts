import { BadRequestException, Controller, HttpCode, Param, Patch } from "@nestjs/common";
import { ReadNotificationsUseCase } from "src/domain/notification/application/use-cases/read-notification";
import { CurrentUser } from "src/infra/auth/current-user-decorator";
import { UserPayload } from "src/infra/auth/jwt.strategy";

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController{

    constructor(
        private readNotifications: ReadNotificationsUseCase
    ){}
    @Patch()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('notificationId') notificationId: string
        ){

        const result = await this.readNotifications.execute({
            notificationId,
            recipientId: user.sub
        })

        if(result.isLeft()){
            throw new BadRequestException()
        }

    }
}