import type { File as APIFile } from "stoat-api";

import type { Client } from "../Client.js";
import { File } from "../classes/File.js";

import type { Hydrate } from "./index.js";

/**
 * Entity type for a scheduled event
 */
export type ScheduledEventEntityType = "Voice" | "StageInstance" | "External";

/**
 * Status of a scheduled event
 */
export type ScheduledEventStatus =
  | "Scheduled"
  | "Active"
  | "Completed"
  | "Cancelled";

/**
 * API representation of a scheduled event
 */
export type APIScheduledEvent = {
  _id: string;
  server: string;
  creator_id: string;
  name: string;
  description?: string;
  entity_type: ScheduledEventEntityType;
  channel_id?: string;
  location?: string;
  scheduled_start_time: string;
  scheduled_end_time?: string;
  status: ScheduledEventStatus;
  cover_image?: APIFile;
  interested_count: number;
};

/**
 * Data for creating a scheduled event
 */
export type DataCreateScheduledEvent = {
  name: string;
  description?: string;
  entity_type: ScheduledEventEntityType;
  channel_id?: string;
  location?: string;
  scheduled_start_time: string;
  scheduled_end_time?: string;
  cover_image?: string;
};

/**
 * Data for editing a scheduled event
 */
export type DataEditScheduledEvent = {
  name?: string;
  description?: string;
  entity_type?: ScheduledEventEntityType;
  channel_id?: string;
  location?: string;
  scheduled_start_time?: string;
  scheduled_end_time?: string;
  status?: ScheduledEventStatus;
  cover_image?: string;
};

export type HydratedScheduledEvent = {
  id: string;
  serverId: string;
  creatorId: string;
  name: string;
  description?: string;
  entityType: ScheduledEventEntityType;
  channelId?: string;
  location?: string;
  scheduledStartTime: string;
  scheduledEndTime?: string;
  status: ScheduledEventStatus;
  coverImage?: File;
  interestedCount: number;
};

export const scheduledEventHydration: Hydrate<
  APIScheduledEvent,
  HydratedScheduledEvent
> = {
  keyMapping: {
    _id: "id",
    server: "serverId",
    creator_id: "creatorId",
    entity_type: "entityType",
    channel_id: "channelId",
    scheduled_start_time: "scheduledStartTime",
    scheduled_end_time: "scheduledEndTime",
    cover_image: "coverImage",
    interested_count: "interestedCount",
  },
  functions: {
    id: (event) => event._id,
    serverId: (event) => event.server,
    creatorId: (event) => event.creator_id,
    name: (event) => event.name,
    description: (event) => event.description,
    entityType: (event) => event.entity_type,
    channelId: (event) => event.channel_id,
    location: (event) => event.location,
    scheduledStartTime: (event) => event.scheduled_start_time,
    scheduledEndTime: (event) => event.scheduled_end_time,
    status: (event) => event.status,
    coverImage: (event, ctx) =>
      event.cover_image
        ? new File(ctx as Client, event.cover_image)
        : undefined,
    interestedCount: (event) => event.interested_count ?? 0,
  },
  initialHydration: () => ({
    interestedCount: 0,
    status: "Scheduled" as const,
  }),
};
