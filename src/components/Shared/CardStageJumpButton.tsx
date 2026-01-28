import { ArrowUpRightIcon } from 'lucide-react'
import { useMultiStageStore } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import { cn } from '@/src/lib/Shared/utils'

/**
 * This component renders a simple button that allows users to switch to a given section. It is designed to position itself in the top left corner when using within the `Card` component.
 * @param options.targetStage The stage to jump to when the button is clicked
 * @param options.className Override classes of the button
 * @param options.label The optional label to e.g. support localization.
 */
export function CardStageJumpButton({ targetStage, className, label = 'Jump back' }: { label?: string; targetStage: number; className?: string }) {
  const { setStage, stage } = useMultiStageStore((store) => store)

  return (
    <button
      type='button'
      className={cn('hover: absolute top-1 right-2 flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-neutral-500/90 hover:ring-1 dark:text-neutral-400/90', className)}
      onClick={() => (stage !== targetStage ? setStage(targetStage) : null)}>
      <span>{label}</span>
      <ArrowUpRightIcon className='size-5' />
    </button>
  )
}
