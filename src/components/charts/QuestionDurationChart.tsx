'use client'

import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/shadcn/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/src/components/shadcn/chart'
import { useScopedI18n } from '@/src/i18n/client-localization'
import randomRange from '@/src/lib/Shared/randomRange'
import { cn } from '@/src/lib/Shared/utils'
import { instantiateQuestion, Question } from '@/src/schemas/QuestionSchema'
import { Any } from '@/types'

export function ExamQuestionDurationChart({ title, description, questions }: { title: string; description?: string; questions?: Question[] }) {
  const tShared = useScopedI18n('Shared.Timestamp')
  const t = useScopedI18n('Checks.ExaminatonResults.Charts.ExamQuestionDurationChart')
  if (!questions || questions.length === 0) questions = Array.from({ length: 15 }, () => instantiateQuestion())

  const dataQuestions = React.useMemo(() => {
    if (!questions || questions.length === 0) questions = Array.from({ length: 15 }, () => instantiateQuestion())

    const data: { name: string; actualTime: number; difference: number; estimated: number }[] = []

    questions.forEach((q, i) => {
      const estimated = randomRange({ min: 3, max: 15, multiplyFactor: 15, rounded: true })
      const actualTime = randomRange({ min: 3, max: 15, multiplyFactor: 15, rounded: true })
      const difference = estimated - actualTime

      data.push({
        name: `${i + 1}`,
        estimated,
        actualTime,
        difference,
      })
    })

    return data
  }, [questions])

  const gradientOffset = () => {
    const dataMax = Math.max(...dataQuestions.map((i) => i.difference))
    const dataMin = Math.min(...dataQuestions.map((i) => i.difference))

    if (dataMax <= 0) {
      return 0
    }
    if (dataMin >= 0) {
      return 1
    }

    return dataMax / (dataMax - dataMin)
  }

  const off = gradientOffset()

  const chartConfig = React.useMemo((): ChartConfig => ({}), [])

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-[250px] w-full'>
          <AreaChart data={dataQuestions} margin={{ left: -15, right: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray='3 3' className='dark:stroke-neutral-500' />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name, item, index) => {
                    return (
                      <div className='mt-2 flex flex-col gap-1'>
                        <div className='flex flex-col gap-1.5'>
                          <div className='flex items-center justify-between gap-4'>
                            <div className='flex items-center gap-2'>
                              <div className={cn('size-2.5 shrink-0 rounded-[2px]', 'bg-chart-2')} />
                              {t('tooltip.estimated_time_label')}
                            </div>
                            <div className='flex flex-1 items-baseline justify-end gap-1 text-right font-mono font-medium text-foreground tabular-nums'>
                              {item.payload.estimated}
                              <span className='font-normal text-muted-foreground'>{tShared('minute_label', { count: item.payload.estimated })}</span>
                            </div>
                          </div>
                          <div className='flex items-center justify-between gap-4'>
                            <div className='flex items-center gap-2'>
                              <div className={cn('size-2.5 shrink-0 rounded-[2px]', 'bg-chart-3')} />
                              {t('tooltip.actual_time_label')}
                            </div>
                            <div className='flex flex-1 items-baseline justify-end gap-1 text-right font-mono font-medium text-foreground tabular-nums'>
                              {item.payload.actualTime}
                              <span className='font-normal text-muted-foreground'>{tShared('minute_label', { count: item.payload.actualTime })}</span>
                            </div>
                          </div>
                        </div>

                        <div className='mt-1.5 flex items-center border-t pt-1.5 text-xs font-medium text-foreground'>
                          {item.payload.difference > 0 ? (
                            <span className='text-[oklch(59.2%_0.309_151.711)] dark:text-green-400'>{t('tooltip.total_faster_label')}</span>
                          ) : (
                            // eslint-disable-next-line require-color-modes/require-color-mode-styles
                            <span className='text-red-400'>{t('tooltip.total_slower_label')}</span>
                          )}
                          <div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium text-foreground tabular-nums'>
                            <span className={cn(item.payload.difference > 0 ? 'text-[oklch(59.2%_0.309_151.711)] dark:text-green-400' : 'text-red-400')}>{Math.abs(item.payload.difference)}</span>
                            <span
                              className={cn(
                                'font-normal',
                                item.payload.difference > 0 ? 'text-[oklch(59.2%_0.309_151.711)]/50 dark:text-[oklch(79.2%_0.07_151.711)]' : 'text-[oklch(70.4%_0.07_22.216)]',
                              )}>
                              {tShared('minute_label', { count: Math.abs(item.payload.difference) })}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }}
                />
              }
              labelFormatter={(_, payload) => t('tooltip.title', { count: payload[0].payload.name })}
            />
            <defs>
              <linearGradient id='splitColor' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0' stopColor='green' stopOpacity={1} />
                <stop offset={off} stopColor='green' stopOpacity={0.15} />
                <stop offset={off} stopColor='red' stopOpacity={0.15} />
                <stop offset='1' stopColor='red' stopOpacity={1} />
              </linearGradient>
            </defs>
            <XAxis
              //* shows every second tick-label
              tick={({ payload, ...props }) => {
                if (payload.value % 2 !== 0) return <></>

                return (
                  <text x={props.x} textAnchor='middle' y={props.y + props.height / 3} className='' fill='gray'>
                    {payload.value + 1}
                  </text>
                )
              }}
              label={({ viewBox: { x, y, width, height } }: Any) => (
                <text x={x + width / 2 - 20} y={y + height + 3} className='' fill='gray'>
                  {t('x_axis_label')}
                </text>
              )}
            />
            <YAxis
              domain={([dataMin, dataMax]) => {
                // ensure that the domain is at least -10, 10  or greater than that depending on min/max values
                const updatedDomain: Any = [dataMin < -10 ? dataMin - 2 : -10, dataMax > 10 ? dataMax + 2 : 10]
                // console.log('Normalized domain', ...updatedDomain, 'min: ', dataMin, 'max: ', dataMax)
                return updatedDomain
              }}
              label={<AxisLabel>{t('y_axis_label')}</AxisLabel>}
            />
            <Area type='monotone' dataKey='difference' className='text-neutral-400 dark:text-neutral-500' stroke='currentColor' fill='url(#splitColor)' />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
const AxisLabel = ({ children, viewBox: { x, y, width, height }, ...props }: Any) => {
  const isVert = true
  const cx = isVert ? x : x + width / 2
  const cy = isVert ? height / 2 + y : y + height + 10
  const rot = isVert ? `270 ${cx} ${cy}` : 0
  return (
    <text x={cx} y={cy} transform={`rotate(${rot})`} className='translate-x-8' fill='gray' textAnchor='middle'>
      {children}
    </text>
  )
}
