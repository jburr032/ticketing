import {
  Publisher,
  Subjects,
  ExpirationCompletedEvent,
} from "@parkerco/common";

export class ExpirationCompletedPublisher extends Publisher<
  ExpirationCompletedEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
