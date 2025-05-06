
import { ReadNotificationsUseCase } from "./read-notification"
import { makeNotification } from "test/factories/make-notification"
import { UniqueEntityID } from "src/core/entities/unique-entity-id"
import { NotAllowedError } from "src/core/errors/errors/not-allowed-error"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"


let inMemoryNotificationsRepository: InMemoryNotificationsRepository
//system under test
let sut: ReadNotificationsUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationsUseCase(inMemoryNotificationsRepository)
  })
  it('should be able to read a notification', async () => {

    const notificaiton = makeNotification()
    inMemoryNotificationsRepository.create(notificaiton)
      
    const result = await sut.execute({
      recipientId: notificaiton.recipientId.toString(),
      notificationId: notificaiton.id.toString()
    })
  
    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(expect.any(Date))
    
  })

  it('should not be able to read a notification from another user', async () => {

    const notification = makeNotification({recipientId: new UniqueEntityID('recipient-1')})

    inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(), recipientId: 'author-2'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
      
  })

})

