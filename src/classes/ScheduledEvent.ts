import type { ScheduledEventCollection } from "../collections/ScheduledEventCollection.js";
import { hydrate } from "../hydration/index.js";
import type {
  DataEditScheduledEvent,
  ScheduledEventEntityType,
  ScheduledEventStatus,
} from "../hydration/scheduledEvent.js";

import type { Channel } from "./Channel.js";
import type { File } from "./File.js";
import type { Server } from "./Server.js";
import type { User } from "./User.js";

/**
 * Scheduled Event Class
 */
export class ScheduledEvent {
  readonly #collection: ScheduledEventCollection;
  readonly id: string;

  /**
   * Construct Scheduled Event
   * @param collection Collection
   * @param id Scheduled Event Id
   */
  constructor(collection: ScheduledEventCollection, id: string) {
    this.#collection = collection;
    this.id = id;
  }

  /**
   * Whether this object exists
   */
  get $exists(): boolean {
    return !!this.#collection.getUnderlyingObject(this.id).id;
  }

  /**
   * Server ID this event belongs to
   */
  get serverId(): string {
    return this.#collection.getUnderlyingObject(this.id).serverId;
  }

  /**
   * Server this event belongs to
   */
  get server(): Server | undefined {
    return this.#collection.client.servers.get(
      this.#collection.getUnderlyingObject(this.id).serverId,
    );
  }

  /**
   * Creator's user ID
   */
  get creatorId(): string {
    return this.#collection.getUnderlyingObject(this.id).creatorId;
  }

  /**
   * Creator of the event
   */
  get creator(): User | undefined {
    return this.#collection.client.users.get(
      this.#collection.getUnderlyingObject(this.id).creatorId,
    );
  }

  /**
   * Event name
   */
  get name(): string {
    return this.#collection.getUnderlyingObject(this.id).name;
  }

  /**
   * Event description
   */
  get description(): string | undefined {
    return this.#collection.getUnderlyingObject(this.id).description;
  }

  /**
   * Entity type (Voice, StageInstance, External)
   */
  get entityType(): ScheduledEventEntityType {
    return this.#collection.getUnderlyingObject(this.id).entityType;
  }

  /**
   * Channel ID (for Voice/StageInstance entity types)
   */
  get channelId(): string | undefined {
    return this.#collection.getUnderlyingObject(this.id).channelId;
  }

  /**
   * Channel (for Voice/StageInstance entity types)
   */
  get channel(): Channel | undefined {
    const channelId = this.#collection.getUnderlyingObject(this.id).channelId;
    return channelId
      ? this.#collection.client.channels.get(channelId)
      : undefined;
  }

  /**
   * Location (for External entity type)
   */
  get location(): string | undefined {
    return this.#collection.getUnderlyingObject(this.id).location;
  }

  /**
   * Scheduled start time (ISO 8601 string)
   */
  get scheduledStartTime(): string {
    return this.#collection.getUnderlyingObject(this.id).scheduledStartTime;
  }

  /**
   * Scheduled start time as a Date object
   */
  get scheduledStartDate(): Date {
    return new Date(this.scheduledStartTime);
  }

  /**
   * Scheduled end time (ISO 8601 string)
   */
  get scheduledEndTime(): string | undefined {
    return this.#collection.getUnderlyingObject(this.id).scheduledEndTime;
  }

  /**
   * Scheduled end time as a Date object
   */
  get scheduledEndDate(): Date | undefined {
    return this.scheduledEndTime
      ? new Date(this.scheduledEndTime)
      : undefined;
  }

  /**
   * Event status (Scheduled, Active, Completed, Cancelled)
   */
  get status(): ScheduledEventStatus {
    return this.#collection.getUnderlyingObject(this.id).status;
  }

  /**
   * Cover image
   */
  get coverImage(): File | undefined {
    return this.#collection.getUnderlyingObject(this.id).coverImage;
  }

  /**
   * URL to the cover image
   */
  get coverImageURL(): string | undefined {
    return this.coverImage?.createFileURL();
  }

  /**
   * Number of users interested in this event
   */
  get interestedCount(): number {
    return this.#collection.getUnderlyingObject(this.id).interestedCount;
  }

  /**
   * Edit this scheduled event
   * @param data Changes
   */
  async edit(data: DataEditScheduledEvent): Promise<void> {
    const updated = await this.#collection.client.api.patch(
      `/servers/${this.serverId as ""}/events/${this.id as ""}` as never,
      data as never,
    );

    this.#collection.updateUnderlyingObject(
      this.id,
      hydrate(
        "scheduledEvent",
        updated as never,
        this.#collection.client,
        false,
      ),
    );
  }

  /**
   * Delete this scheduled event
   */
  async delete(): Promise<void> {
    await this.#collection.client.api.delete(
      `/servers/${this.serverId as ""}/events/${this.id as ""}` as never,
    );

    this.#collection.delete(this.id);
  }

  /**
   * Add interest (RSVP) to this event
   */
  async addInterest(): Promise<void> {
    await this.#collection.client.api.put(
      `/servers/${this.serverId as ""}/events/${this.id as ""}/interest` as never,
    );
  }

  /**
   * Remove interest (RSVP) from this event
   */
  async removeInterest(): Promise<void> {
    await this.#collection.client.api.delete(
      `/servers/${this.serverId as ""}/events/${this.id as ""}/interest` as never,
    );
  }
}
