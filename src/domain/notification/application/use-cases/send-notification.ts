import { NotificationsRepository } from 'src/domain/notification/application/repositories/notifications-repository'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Either, right } from 'src/core/either'
import { Notification } from '../../enterprise/entities/notification'

export interface SendNotificationsUseCaseRequest {
  recipientId: string,
  title: string,
  content: string
}

export type SendNotificationUseCaseResponse = Either<null, {
    notification: Notification
}>

export class SendNotificationsUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}
  async execute({
    recipientId,
    title, 
    content,
  }: SendNotificationsUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content
    })    

    await this.notificationRepository.create(notification)

    return right({notification})
  }
}
