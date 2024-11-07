<script lang="ts" setup>
import type { ChatMessage } from '~/types/chat'

const props = defineProps<{
  message: ChatMessage
  sending: boolean
  showToggleButton?: boolean
}>()

const emits = defineEmits<{
  resend: [message: ChatMessage]
  remove: [message: ChatMessage]
}>()

const markdown = useMarkdown()

const opened = ref(props.showToggleButton === true ? false : true)
const isModelMessage = computed(() => props.message.role === 'assistant')
const contentClass = computed(() => {
  return [
    isModelMessage.value ? 'max-w-[calc(100%-2rem)]' : 'max-w-full',
    props.message.type === 'error'
      ? 'bg-red-50 dark:bg-red-800/60'
      : (isModelMessage.value ? 'bg-gray-50 dark:bg-gray-800' : 'bg-primary-100/60 dark:bg-primary-700/60'),
  ]
})

const timeUsed = computed(() => {
  const endTime = props.message.type === 'loading' ? Date.now() : props.message.endTime
  return Number(((endTime - props.message.startTime) / 1000).toFixed(1))
})

const modelName = computed(() => {
  return parseModelValue(props.message.model)
})

watch(() => props.showToggleButton, (value) => {
  opened.value = value === true ? false : true
})
</script>

<template>
  <div class="flex flex-col message-item" :class="{ 'pt-6': !isModelMessage }">
    <div class="text-gray-500 dark:text-gray-400 p-1 flex items-center min-h-[34px]">
      <Icon v-if="message.role === 'user'" name="i-material-symbols-account-circle" class="text-lg" />
      <div v-else class="text-sm flex items-center">
        <UTooltip :text="modelName.family" :popper="{ placement: 'top' }">
          <span class="text-primary/80">{{ modelName.name }}</span>
        </UTooltip>
        <template v-if="timeUsed > 0">
          <span class="mx-2 text-muted/20 text-xs">|</span>
          <span class="text-gray-400 dark:text-gray-500 text-xs">{{ timeUsed }}s</span>
        </template>
      </div>
      <ChatMessageActionMore :message="message"
                             :disabled="sending"
                             class="ml-4 action-more"
                             @resend="emits('resend', message)"
                             @remove="emits('remove', message)" />
    </div>
    <div class="leading-6 text-sm flex items-center max-w-full message-content"
         :class="{ 'text-gray-400 dark:text-gray-500': message.type === 'canceled' }">
      <div class="flex rounded-lg overflow-hidden box-border"
           :class="contentClass">
        <div v-if="message.type === 'loading'" class="text-xl text-primary px-3 py-2">
          <span class="block i-svg-spinners-3-dots-scale"></span>
        </div>
        <template v-else-if="isModelMessage">
          <div class="px-3 py-2 overflow-hidden">
            <div v-html="markdown.render(message.content || '')" class="md-body" :class="{ 'line-clamp-4 max-h-[8rem]': !opened }" />
          </div>
          <MessageToggleCollapseButton v-if="showToggleButton" :opened="opened" @click="opened = !opened" />
        </template>
        <pre v-else v-text="message.content" class="px-3 py-2 whitespace-break-spaces" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.message-item {
  .action-more {
    opacity: 0;
    transform-origin: 0 center;
    transform: scale(0.5) translateX(-1rem);
    transition: all 0.3s ease-in-out;
  }

  &:hover {
    .action-more {
      transform: scale(0.9) translateX(0);
      opacity: 1;
    }
  }
}
</style>
