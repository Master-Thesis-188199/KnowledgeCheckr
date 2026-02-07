'use client'

import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/shadcn/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/src/components/shadcn/chart'
import { cn } from '@/src/lib/Shared/utils'
import { instantiateQuestion, Question } from '@/src/schemas/QuestionSchema'
import { Any } from '@/types'

export function ExamQuestionDurationChart({ title, description, questions }: { title: string; description?: string; questions?: Question[] }) {
  if (!questions || questions.length === 0) questions = Array.from({ length: 15 }, () => instantiateQuestion())

  const dataQuestions = React.useMemo(() => {
    if (!questions || questions.length === 0) questions = Array.from({ length: 15 }, () => instantiateQuestion())

    const data: { name: string; actualTime: number; difference: number; estimated: number }[] = []

    questions.forEach((q, i) => {
      const estimated = Math.round(Math.random() * 15)
      const actualTime = Math.round(Math.random() * 15)
      const difference = estimated - actualTime

      data.push({
        name: `${i + 1}`,
        estimated,
        actualTime,
        difference,
      })
    })

    console.log(data)
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
                  label='Time Difference'
                  formatter={(value, name, item, index) => {
                    return (
                      <div className='mt-2 flex flex-col gap-1'>
                        <div className='flex flex-col gap-1.5'>
                          <div className='flex items-center justify-between gap-4'>
                            <div className='flex items-center gap-2'>
                              <div className={cn('h-2.5 w-2.5 shrink-0 rounded-[2px]', 'bg-chart-2')} />
                              Estimated Time
                            </div>
                            <div className='text-foreground flex flex-1 items-baseline justify-end gap-1 text-right font-mono font-medium tabular-nums'>
                              {item.payload.estimated}
                              <span className='text-muted-foreground font-normal'>minutes</span>
                            </div>
                          </div>
                          <div className='flex items-center justify-between gap-4'>
                            <div className='flex items-center gap-2'>
                              <div className={cn('h-2.5 w-2.5 shrink-0 rounded-[2px]', 'bg-chart-3')} />
                              Time needed
                            </div>
                            <div className='text-foreground flex flex-1 items-baseline justify-end gap-1 text-right font-mono font-medium tabular-nums'>
                              {item.payload.actualTime}
                              <span className='text-muted-foreground font-normal'>minutes</span>
                            </div>
                          </div>
                        </div>

                        <div className='text-foreground mt-1.5 flex items-center border-t pt-1.5 text-xs font-medium'>
                          {item.payload.difference > 0 ? (
                            <span className='text-[oklch(59.2%_0.309_151.711)] dark:text-[oklch(79.2%_0.209_151.711)]'>Faster by</span>
                          ) : (
                            // eslint-disable-next-line require-color-modes/require-color-mode-styles
                            <span className='text-red-400'>Slower by</span>
                          )}
                          <div className='text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums'>
                            <span className={cn(item.payload.difference > 0 ? 'text-[oklch(59.2%_0.309_151.711)] dark:text-[oklch(79.2%_0.209_151.711)]' : 'text-red-400')}>
                              {Math.abs(item.payload.difference)}
                            </span>
                            <span
                              className={cn(
                                'font-normal',
                                item.payload.difference > 0 ? 'text-[oklch(59.2%_0.309_151.711)]/50 dark:text-[oklch(79.2%_0.07_151.711)]' : 'text-[oklch(70.4%_0.07_22.216)]',
                              )}>
                              minutes
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }}
                />
              }
              labelFormatter={(_, payload) => `Question ${payload[0].payload.name}`}
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
              label={({ viewBox: { x, y, width, height } }: Any) => (
                <text x={x + width / 2 - 20} y={y + height + 3} className='' fill='gray'>
                  Questions
                </text>
              )}
            />
            <YAxis label={<AxisLabel>Time spent</AxisLabel>} domain={[-10, 10]} />
            <Area type='monotone' dataKey='difference' stroke='#000' fill='url(#splitColor)' />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
const AxisLabel = ({ children, viewBox: { x, y, width, height }, ...props }: Any) => {
  console.log(props)
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
