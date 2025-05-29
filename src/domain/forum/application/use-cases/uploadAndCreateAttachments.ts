import { Either, left, right } from 'src/core/either'
import { Injectable } from '@nestjs/common'
import { InvalidAttchmentTypeError } from './errors/invalid-attachment-type'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'

interface UpdateAndCreateAttachmentsUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UpdateAndCreateAttachmentsUseCaseResponse = Either< InvalidAttchmentTypeError, {
    attachment: Attachment
}>

@Injectable()
export class UploadAndCreateAttachmentsUseCase {
  constructor(
    private attachmentRepository: AttachmentsRepository,
    private uploader: Uploader
    ) {}
  async execute({
    fileName,
    fileType,
    body
  }: UpdateAndCreateAttachmentsUseCaseRequest): Promise<UpdateAndCreateAttachmentsUseCaseResponse> {

    if (!/^(image\/(png|jpeg)|application\/pdf)$/.test(fileType)) {
        return left(new InvalidAttchmentTypeError(fileType))
      }

    const {url} = await this.uploader.upload({
        fileName,
        fileType,
        body
    })

    const attachment = Attachment.create({
        title: fileName,
        url: fileName

    })

    await this.attachmentRepository.create(attachment)

    return right({
        attachment
    })
    
  }
}
