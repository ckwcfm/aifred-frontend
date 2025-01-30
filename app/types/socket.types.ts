import type { Socket } from 'socket.io-client'
import type { TMessage } from '~/schemas/socket.shemas'

export type ServerToClientEvents = {
  roomJoined: (message: string) => void
  message: (message: string) => void
  roomMessage: (message: TMessage) => void
  typing: (data: { isTyping: boolean; senderName: string }) => void
  streamChunk: (data: {
    chunk: string
    isDone: boolean
    messageId: string
  }) => void
}

export type ClientToServerEvents = {
  joinRoom: (userId: string) => void
  message: (message: string) => void
  messageToRoom: (data: TMessage) => void
}

export type TSocket = Socket<ServerToClientEvents, ClientToServerEvents>
