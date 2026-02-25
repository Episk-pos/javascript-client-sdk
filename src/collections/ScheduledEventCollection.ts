import { ScheduledEvent } from "../classes/ScheduledEvent.js";
import type {
  APIScheduledEvent,
  HydratedScheduledEvent,
} from "../hydration/scheduledEvent.js";

import { ClassCollection } from "./Collection.js";

/**
 * Collection of Scheduled Events
 */
export class ScheduledEventCollection extends ClassCollection<
  ScheduledEvent,
  HydratedScheduledEvent
> {
  /**
   * Get or create
   * @param id Id
   * @param data Data
   * @param isNew Whether this object is new
   */
  getOrCreate(
    id: string,
    data: APIScheduledEvent,
    isNew = false,
  ): ScheduledEvent {
    if (this.has(id) && !this.isPartial(id)) {
      return this.get(id)!;
    } else {
      const instance = new ScheduledEvent(this, id);
      this.create(id, "scheduledEvent", instance, this.client, data);
      return instance;
    }
  }

  /**
   * Get or return partial
   * @param id Id
   */
  getOrPartial(id: string): ScheduledEvent | undefined {
    if (this.has(id)) {
      return this.get(id)!;
    } else if (this.client.options.partials) {
      const instance = new ScheduledEvent(this, id);
      this.create(id, "scheduledEvent", instance, this.client, {
        id,
        partial: true,
      });
      return instance;
    }
  }
}
