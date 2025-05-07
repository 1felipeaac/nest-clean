import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository"
import { RegisterStudentsUseCase } from "./register-student"
import { FakeHasher } from "test/cryptography/fake-hasher"

let inMemoryStudentsRepository: InMemoryStudentsRepository
//system under test
let sut: RegisterStudentsUseCase
let fakehasher: FakeHasher

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakehasher = new FakeHasher()
    sut = new RegisterStudentsUseCase(inMemoryStudentsRepository, fakehasher)
  })
  it('should be able to registar a new student', async () => {
      
    const result = await sut.execute({
      name: 'Felipe',
      email: 'felipe@email.com',
      password: '123456'
    })
  
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
        student: inMemoryStudentsRepository.items[0]
    })
  })

  it('should hash student password upon register', async () => {
      
    const result = await sut.execute({
      name: 'Felipe',
      email: 'felipe@email.com',
      password: '123456'
    })

    const hashedPassword = await fakehasher.hash('123456')
  
    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
  })

})