
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { SendNotificationsUseCase } from "./send-notification"


let inMemoryNotificationsRepository: InMemoryNotificationsRepository
//system under test
let sut: SendNotificationsUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationsUseCase(inMemoryNotificationsRepository)
  })
  it('should be able to send a notification', async () => {
      
    const result = await sut.execute({
      recipientId: '1',
      title: 'Nova notificação',
      content: 'Conteudo da notificação',
    })
  
    expect(result.isRight()).toBe(true)
    
    expect(result.value?.notification.id).toBeTruthy()
    expect(inMemoryNotificationsRepository.items[0]).toEqual(result.value?.notification)
    
  })

})

