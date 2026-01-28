import { ArrowUpRightIcon } from 'lucide-react'
import { Button } from '@/src/components/shadcn/button'
import { useMultiStageStore } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { cn } from '@/src/lib/Shared/utils'

/**
 * This component renders a simple button that allows users to switch to a given section. It is designed to position itself in the top left corner when using within the `Card` component.
 * @param options.targetStage The stage to jump to when the button is clicked
 * @param options.className Override classes of the button
 * @param options.label The optional label to e.g. support localization.
 */
export function CardStageJumpButton({ targetStage, className, label }: { label?: string; targetStage: number; className?: string }) {
  const t = useScopedI18n('Shared')
  const { setStage, stage } = useMultiStageStore((store) => store)

  return (
    <Button
      type='button'
      variant='ghost'
      size='sm'
      className={cn('absolute top-1 right-2 flex items-center gap-1 text-neutral-500/90 dark:text-neutral-400/90', className)}
      onClick={() => (stage !== targetStage ? setStage(targetStage) : null)}>
      <span>{label ?? t('jump_back_button_label')}</span>
      <ArrowUpRightIcon className='size-5' />
    </Button>
  )
}
