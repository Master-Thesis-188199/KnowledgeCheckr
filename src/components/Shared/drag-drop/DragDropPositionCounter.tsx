export function DragDropItemPositionCounter({ initialIndex }: { initialIndex: number }) {
  return <span className='current-position'>{initialIndex + 1}.</span>
}
