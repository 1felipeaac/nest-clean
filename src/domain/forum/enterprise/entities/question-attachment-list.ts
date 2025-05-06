import { WatchedList } from "src/core/entities/whatched-list";
import { QuestionAttachment } from "./question-attachment";

export class QuestionAttachmentList extends WatchedList<QuestionAttachment>{
    compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
        return a.attachmentId.equals(b.attachmentId)
    }

}