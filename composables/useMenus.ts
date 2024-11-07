
export const DEFAULT_PAGE_LINK = '/welcome'

export function useMenus() {
  const { t } = useI18n()

  return computed(() => [
    { label: t('menu.chat'), icon: 'i-iconoir-chat-lines', to: '/chat' },
    { label: t('menu.instructions'), icon: 'i-iconoir-terminal', to: '/instructions' },
    { label: t('menu.settings'), icon: 'i-heroicons-cog-6-tooth', to: '/settings' }
  ])
}
