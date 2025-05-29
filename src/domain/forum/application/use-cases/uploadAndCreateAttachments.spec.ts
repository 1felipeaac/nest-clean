import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository"
import { UploadAndCreateAttachmentsUseCase } from "./uploadAndCreateAttachments"
import { FakeUploader } from "test/storage/fake-uploader"
import { InvalidAttchmentTypeError } from "./errors/invalid-attachment-type"

let inMemoryAttachmentRepository: InMemoryAttachmentsRepository
//system under test
let sut: UploadAndCreateAttachmentsUseCase
let fakeUploader: FakeUploader

describe('Update and Create ', () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentsUseCase(inMemoryAttachmentRepository, fakeUploader)
  })
  it('should be able upload and create attachment', async () => {
      
    const result = await sut.execute({
     fileName: 'profile.png',
     fileType: 'image/png',
     body: Buffer.from('')
    })
  
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
        attachment: inMemoryAttachmentRepository.items[0]
    })

    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
        expect.objectContaining({
            fileName: 'profile.png'
        })
    )
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
      
    const result = await sut.execute({
        fileName: 'profile.mp3',
        fileType: 'audio/mpeg',
        body: Buffer.from('')
       })

  
       expect(result.isLeft()).toBe(true)
       expect(result.value).toBeInstanceOf(InvalidAttchmentTypeError)
  })

})