'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/card'
import { type ChartConfig, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from '@/shadcn/chart'
import { cn } from '@/src/lib/Shared/utils'
import { Any } from '@/types'

type ChartData = {
  questionIndex: number
  score: number
  maxScore: number
}

const data: ChartData[] = [
  { questionIndex: 0, score: 5, maxScore: 5 },
  { questionIndex: 1, score: 6, maxScore: 7 },
  { questionIndex: 2, score: 7, maxScore: 14 },
  { questionIndex: 3, score: 9, maxScore: 9 },
  { questionIndex: 4, score: 11, maxScore: 14 },
  { questionIndex: 5, score: 3, maxScore: 4 },
  { questionIndex: 6, score: 2, maxScore: 2 },
  { questionIndex: 7, score: 12, maxScore: 12 },
  { questionIndex: 8, score: 15, maxScore: 16 },
  { questionIndex: 9, score: 17, maxScore: 18 },
  { questionIndex: 10, score: 5, maxScore: 5 },
  { questionIndex: 11, score: 3, maxScore: 7 },
  { questionIndex: 12, score: 2, maxScore: 12 },
  { questionIndex: 13, score: 5, maxScore: 6 },
  { questionIndex: 14, score: 10, maxScore: 14 },
]

const chartConfig = {} satisfies ChartConfig

export function QuestionScoresLineChartCard({ title, description }: { title: string; description?: string }) {
  return (
    <Card>
      <CardHeader className='flex flex-col items-stretch border-b sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 pb-3 sm:pb-0'>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className='mt-auto px-2'>
        <QuestionScoresLineChart />
      </CardContent>
    </Card>
  )
}

export function QuestionScoresLineChart({ data: initialData = data, className }: { data?: ChartData[]; className?: string }) {
  return (
    <ChartContainer config={chartConfig} className={cn('aspect-auto h-[250px] w-full', className)}>
      <AreaChart
        accessibilityLayer
        data={initialData}
        margin={{
          right: 12,
          bottom: 5,
        }}>
        <CartesianGrid vertical={true} horizontal={false} />
        <YAxis width={15} axisLine={false} tick={() => <></>} tickLine={false} />
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
              Questions
            </text>
          )}
          dataKey='questionIndex'
          tickLine={false}
        />
        <defs>
          <linearGradient id='fillScore' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='var(--chart-2)' stopOpacity={0.9} />
            <stop offset='95%' stopColor='var(--chart-2)' stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id='fillMaxScore' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='var(--color-chart-3)' stopOpacity={0.9} />
            <stop offset='95%' stopColor='var(--color-chart-3)' stopOpacity={0.3} />
          </linearGradient>
        </defs>

        <ChartTooltip content={<ChartTooltipContent className='w-[150px]' nameKey='score' />} />
        <Area type='bumpX' dataKey={'score'} stroke={`var(--chart-2)`} strokeWidth={3} stackId='a' dot={true} fill='url(#fillScore)' />
        <Area type='bumpX' label={'Question Points'} dataKey={'maxScore'} stroke={`var(--chart-3)`} strokeWidth={3} stackId='a' dot={true} fill='url(#fillMaxScore)' />
        <ChartLegend wrapperStyle={{ bottom: '-10px', left: '25px', margin: '0px 15px 0px 25px', width: 'stretch' }} />
      </AreaChart>
    </ChartContainer>
  )
}
