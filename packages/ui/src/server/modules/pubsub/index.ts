import { PubSub } from 'apollo-server'

export const PUBSUB_HOOKS_CHANGED = 'PUBSUB_HOOKS_CHANGED'
export const SERVER_STATE = 'SERVER_STATE'

export const pubsub = new PubSub()
