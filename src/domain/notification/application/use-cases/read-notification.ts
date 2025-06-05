import { NotificationsRepository } from 'src/domain/notification/application/repositories/notifications-repository'
import { Either, left, right } from 'src/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { ResourceNotFoundError } from 'src/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from 'src/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface ReadNotificationsUseCaseRequest {
  recipientId: string,
  notificationId: string,
}

type ReadNotificationUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
    notification: Notification
}>

@Injectable()
export class ReadNotificationsUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}
  async execute({
    recipientId,
    notificationId, 
  }: ReadNotificationsUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {

    const notification = await this.notificationRepository.findById(notificationId)

    if (!notification) {
        return left(new ResourceNotFoundError())
    }

    if(recipientId !== notification.recipientId.toString()){
        return left(new NotAllowedError())
    }
    
    notification.read()

    await this.notificationRepository.save(notification)

    return right({notification})
  }
}
