import { AggregateRoot } from 'src/core/entities/aggregate-root'
import { Slug } from './value-objects/slug'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'
import dayjs from 'dayjs'
import { QuestionAttachment } from './question-attachment'
import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestAnswerChoseEvent } from '../events/question-best-answer-chose-event'

export interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID | null
  title: string
  content: string
  slug: Slug
  attachments: QuestionAttachmentList
  createdAt: Date
  updatedAt?: Date | null
}

export class Question extends AggregateRoot<QuestionProps> {
  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get slug() {
    return this.props.slug
  }

  get attachments(){
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFormText(title)

    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined | null) {
    if(bestAnswerId === undefined || bestAnswerId === null){
      return
    }

    if(this.props.bestAnswerId == undefined || !this.props.bestAnswerId.equals(bestAnswerId)){

      this.addDomainEvent(new QuestionBestAnswerChoseEvent(this, bestAnswerId))
    }

    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  set attachments(attachments: QuestionAttachmentList){
    this.props.attachments = attachments
    this.touch()

  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFormText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return question
  }
}
