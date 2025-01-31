import type { Route } from './+types/chat'
import { getSessionTokens } from '~/utilities/session.server'
import { Button } from '~/components/ui/button'
import { useEffect, useRef, useState } from 'react'
import { useDashboardLayoutContext } from '~/layouts/dashboard-layout'
import { format, isToday } from 'date-fns'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import type { TMessage } from '~/schemas/socket.shemas'
import { Form } from 'react-router'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { buildRoute } from '~/schemas/api.routes.shemas'
import { useApi } from '~/hooks/useApi'

const BASE_URL = import.meta.env.VITE_API_URL
// import 'katex/dist/katex.min.css'

export async function loader({ request }: Route.LoaderArgs) {
  const { accessToken } = await getSessionTokens(request)
  return { accessToken }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { socket, me } = useDashboardLayoutContext()
  const [messages, setMessages] = useState<TMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const { fetchWithAuth } = useApi()
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [typing, setTyping] = useState<{
    isTyping: boolean
    senderName: string
  } | null>(null)

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }
  // load message from api
  useEffect(() => {
    console.log('DEBUG: (chat/useEffect) - line 36', messages)
    const fetchMessages = async () => {
      try {
        if (!me?.id) return
        const roomId = me.id
        const messages = await fetchWithAuth('/api/v1/messages/:id', {
          id: roomId,
        })
        console.log('DEBUG: (chat/useEffect) - line 41', messages)
        setMessages(messages)
      } catch (error) {
        console.error('DEBUG: (chat/useEffect) - line 41', error)
      }
    }
    fetchMessages()
  }, [me])

  useEffect(() => {
    if (!socket) return

    socket.on('roomMessage', (message: TMessage) => {
      setTyping(null)
      setMessages((prev) => {
        // Replace the pending message with the confirmed one
        const messageIndex = prev.findIndex(
          (m) => m.randomId === message.randomId
        )
        if (messageIndex === -1) {
          return [...prev, message]
        }
        const newMessages = [...prev]
        newMessages[messageIndex] = message
        return newMessages
      })
    })

    socket.on('typing', (data: { isTyping: boolean; senderName: string }) => {
      console.log('typing', data)
      setTyping(data)
    })

    return () => {
      socket.off('roomMessage')
      socket.off('typing')
    }
  }, [socket])

  const onSendMessage = () => {
    if (!socket || !inputMessage.trim() || !me) return

    const message: TMessage = {
      roomId: me.id,
      content: inputMessage,
      contentType: 'text',
      senderId: me.id,
      status: 'pending',
      randomId: crypto.randomUUID(),
    }

    socket.emit('messageToRoom', message)
    setMessages((prev) => [...prev, message])
    setInputMessage('')
    // Scroll to bottom after sending message
    setTimeout(scrollToBottom, 0)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSendMessage()
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className='flex flex-col h-full w-full'>
      <div
        ref={messagesContainerRef}
        className='flex-1 p-4 space-y-4 overflow-y-auto scroll-smooth'
      >
        {messages.map((message, index) => (
          <Message
            key={message.randomId || index}
            message={message}
            isOwnMessage={message.senderId === me?.id}
          />
        ))}
        {typing?.isTyping && (
          <div className='text-sm text-gray-500 italic mb-2'>
            {typing.senderName} is typing...
          </div>
        )}
      </div>

      <div className=' flex-shrink-0  border-t p-4'>
        <InputBar
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleKeyPress={handleKeyPress}
          onSendMessage={onSendMessage}
        />
      </div>
    </div>
  )
}

function InputBar({
  inputMessage,
  setInputMessage,
  handleKeyPress,
  onSendMessage,
}: {
  inputMessage: string
  setInputMessage: (value: string) => void
  handleKeyPress: (e: React.KeyboardEvent) => void
  onSendMessage: () => void
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px'
      const scrollHeight = textareaRef.current.scrollHeight
      const rows = 4
      textareaRef.current.style.height =
        Math.min(scrollHeight, rows * 24) + 'px'
    }
  }, [inputMessage])

  return (
    <div className='flex gap-2'>
      <textarea
        ref={textareaRef}
        value={inputMessage}
        onChange={(e) => {
          setInputMessage(e.target.value)
        }}
        onKeyDown={handleKeyPress}
        placeholder='Type a message...'
        className='flex-1 resize-none rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white min-h-[24px] max-h-[96px] overflow-y-auto scroll-smooth no-scrollbar'
        rows={1}
      />
      <Button onClick={onSendMessage} disabled={!inputMessage.trim()}>
        Send
      </Button>
    </div>
  )
}

function Message({
  message,
  isOwnMessage,
}: {
  message: TMessage
  isOwnMessage: boolean
}) {
  return (
    <div className='flex flex-col gap-1'>
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          isOwnMessage
            ? 'ml-auto bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800'
        } ${message.contentType === 'form' ? 'bg-transparent' : ''}`}
      >
        {message.contentType === 'form' ? (
          <FormMessageContent message={message} />
        ) : (
          <MessageContent message={message} />
        )}
      </div>
      <div className={`text-xs opacity-70 ${isOwnMessage ? 'ml-auto' : ''}`}>
        {message.status === 'pending' ? (
          <MessageStatus message={message} />
        ) : (
          <MessageTimestamp message={message} />
        )}
      </div>
    </div>
  )
}

function MessageContent({ message }: { message: TMessage }) {
  return (
    <div>
      <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
    </div>
  )
}

function FormMessageContent({ message }: { message: TMessage }) {
  const content = message.content

  const form = JSON.parse(content)
  const formName = form.form
  const formInputs = form.input
  const formSchema = form.type
  console.log('DEBUG: (chat/FormMessageContent) - line 245', formSchema)

  const formFields = Object.entries(formInputs).map(([key, value]) => {
    return (
      <div className='flex flex-col' key={key}>
        <Label className='font-bold uppercase text-xs pl-2' htmlFor={key}>
          {key}
        </Label>
        <Input type='text' id={key} name={key} value={value as string} />
      </div>
    )
  })

  return (
    <div className='flex flex-col border border-slate-300 rounded-lg'>
      <div className='flex flex-col p-4'>
        <div className='text-xl font-bold uppercase'>{formName}</div>
        <div className='text-sm text-gray-500'>
          please confirm the form data below.
        </div>
      </div>
      <div className='w-full h-[1px] bg-slate-300'></div>
      <Form className='flex flex-col gap-4 p-4'>
        {formFields}
        <Button type='submit'>Confirm</Button>
      </Form>
    </div>
  )
}

function MessageStatus({ message }: { message: TMessage }) {
  return <div>{message.status}</div>
}

function MessageTimestamp({ message }: { message: TMessage }) {
  if (!message.createdAt) return <div></div>

  const messageDate = new Date(message.createdAt)

  return (
    <div>
      {isToday(messageDate)
        ? format(messageDate, 'HH:mm')
        : format(messageDate, 'MMM d, HH:mm')}
    </div>
  )
}
