import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { AuthenticateStudentsUseCase } from "./authenticate-student"
import { makeStudent } from "test/factories/make-students"

let inMemoryStudentsRepository: InMemoryStudentsRepository
//system under test
let sut: AuthenticateStudentsUseCase
let fakehasher: FakeHasher
let fakeEncrypter: FakeEncrypter

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakehasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudentsUseCase(inMemoryStudentsRepository, fakehasher, fakeEncrypter)
  })
  it('should be able to authenticate a student', async () => {

    const student = makeStudent({
        email: 'felipe@email.com',
        password: await fakehasher.hash('123456')
    })

    inMemoryStudentsRepository.items.push(student)
      
      
    const result = await sut.execute({
      email: 'felipe@email.com',
      password: '123456'
    })
  
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
        accessToken: expect.any(String)
    })
  })

})