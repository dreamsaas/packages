import { PubSub } from 'apollo-server'

export const PUBSUB_HOOKS_CHANGED = 'PUBSUB_HOOKS_CHANGED'
export const PUBSUB_UI_SETTINGS_CHANGED = 'PUBSUB_UI_SETTINGS_CHANGED'

export const pubsub = new PubSub()
