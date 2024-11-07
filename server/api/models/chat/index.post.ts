import { Readable } from 'stream'
import { createChatModel } from '@/server/utils/models'
import { BaseMessageLike } from '@langchain/core/messages'

interface RequestBody {
  knowledgebaseId: number
  model: string
  family: string
  messages: {
    role: 'user' | 'assistant'
    content: string
  }[]
  stream: any
}

const SYSTEM_TEMPLATE = `Answer the user's question based on the context below.
Present your answer in a structured Markdown format.

If the context doesn't contain any relevant information to the question, don't make something up and just say "I don't know":

<context>
{context}
</context>

<chat_history>
{chatHistory}
</chat_history>

<question>
{question}
</question>

Answer:
`

const serializeMessages = (messages: RequestBody['messages']): string =>
  messages.map((message) => `${message.role}: ${message.content}`).join("\n")

const transformMessages = (messages: RequestBody['messages']): BaseMessageLike[] =>
  messages.map((message) => [message.role, message.content])

export default defineEventHandler(async (event) => {
  const { knowledgebaseId, model, family, messages, stream } = await readBody<RequestBody>(event)

  const llm = createChatModel(model, family, event)

  if (!stream) {
    const response = await llm.invoke(transformMessages(messages))

    return {
      message: {
        role: 'assistant',
        content: response?.content
      }
    }
  }

  const response = await llm?.stream(messages.map((message: RequestBody['messages'][number]) => {
    return [message.role, message.content]
  }))

  const readableStream = Readable.from((async function* () {
    for await (const chunk of response) {
      const message = {
        message: {
          role: 'assistant',
          content: chunk?.content
        }
      }
      yield `${JSON.stringify(message)} \n\n`
    }
  })())

  return sendStream(event, readableStream)
})
