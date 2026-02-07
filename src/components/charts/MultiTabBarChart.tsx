'use client'

import * as React from 'react'
import { ArrowUpRightIcon } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shadcn/chart'
import { Badge } from '@/src/components/shadcn/badge'
import getKeys from '@/src/lib/Shared/Keys'
import { cn } from '@/src/lib/Shared/utils'
import { Any } from '@/types'

type ChartData<T extends { dataKey: string }> = T & { [K in Exclude<keyof T, 'dataKey'>]: number }

const exemplaryChartData: ChartData<{ dataKey: string; desktop: number; mobile: number; bounce: number; visits: number }>[] = [
  { dataKey: '2024-04-01', desktop: 222, mobile: 150, bounce: 10, visits: 10 },
  { dataKey: '2024-04-02', desktop: 97, mobile: 180, bounce: 20, visits: 20 },
  { dataKey: '2024-04-03', desktop: 167, mobile: 120, bounce: 30, visits: 30 },
  { dataKey: '2024-04-04', desktop: 242, mobile: 260, bounce: 40, visits: 40 },
  { dataKey: '2024-04-05', desktop: 373, mobile: 290, bounce: 50, visits: 50 },
  { dataKey: '2024-04-06', desktop: 301, mobile: 340, bounce: 60, visits: 60 },
  { dataKey: '2024-04-07', desktop: 245, mobile: 180, bounce: 70, visits: 70 },
  { dataKey: '2024-04-08', desktop: 409, mobile: 320, bounce: 80, visits: 80 },
  { dataKey: '2024-04-09', desktop: 59, mobile: 110, bounce: 90, visits: 90 },
  { dataKey: '2024-04-10', desktop: 261, mobile: 190, bounce: 100, visits: 100 },
  { dataKey: '2024-04-11', desktop: 327, mobile: 350, bounce: 110, visits: 110 },
  { dataKey: '2024-04-12', desktop: 292, mobile: 210, bounce: 120, visits: 120 },
  { dataKey: '2024-04-13', desktop: 342, mobile: 380, bounce: 130, visits: 130 },
  { dataKey: '2024-04-14', desktop: 137, mobile: 220, bounce: 140, visits: 140 },
  { dataKey: '2024-04-15', desktop: 120, mobile: 170, bounce: 150, visits: 150 },
  { dataKey: '2024-04-16', desktop: 138, mobile: 190, bounce: 160, visits: 160 },
  { dataKey: '2024-04-17', desktop: 446, mobile: 360, bounce: 170, visits: 170 },
  { dataKey: '2024-04-18', desktop: 364, mobile: 410, bounce: 180, visits: 180 },
  { dataKey: '2024-04-19', desktop: 243, mobile: 180, bounce: 190, visits: 190 },
  { dataKey: '2024-04-20', desktop: 89, mobile: 150, bounce: 200, visits: 200 },
  { dataKey: '2024-04-21', desktop: 137, mobile: 200, bounce: 210, visits: 210 },
  { dataKey: '2024-04-22', desktop: 224, mobile: 170, bounce: 220, visits: 220 },
  { dataKey: '2024-04-23', desktop: 138, mobile: 230, bounce: 230, visits: 230 },
  { dataKey: '2024-04-24', desktop: 387, mobile: 290, bounce: 240, visits: 240 },
  { dataKey: '2024-04-25', desktop: 215, mobile: 250, bounce: 250, visits: 250 },
  { dataKey: '2024-04-26', desktop: 75, mobile: 130, bounce: 260, visits: 260 },
  { dataKey: '2024-04-27', desktop: 383, mobile: 420, bounce: 270, visits: 270 },
  { dataKey: '2024-04-28', desktop: 122, mobile: 180, bounce: 280, visits: 280 },
  { dataKey: '2024-04-29', desktop: 315, mobile: 240, bounce: 290, visits: 290 },
  { dataKey: '2024-04-30', desktop: 454, mobile: 380, bounce: 300, visits: 300 },
  { dataKey: '2024-05-01', desktop: 165, mobile: 220, bounce: 310, visits: 310 },
  { dataKey: '2024-05-02', desktop: 293, mobile: 310, bounce: 320, visits: 320 },
  { dataKey: '2024-05-03', desktop: 247, mobile: 190, bounce: 330, visits: 330 },
  { dataKey: '2024-05-04', desktop: 385, mobile: 420, bounce: 340, visits: 340 },
  { dataKey: '2024-05-05', desktop: 481, mobile: 390, bounce: 350, visits: 350 },
  { dataKey: '2024-05-06', desktop: 498, mobile: 520, bounce: 360, visits: 360 },
  { dataKey: '2024-05-07', desktop: 388, mobile: 300, bounce: 370, visits: 370 },
  { dataKey: '2024-05-08', desktop: 149, mobile: 210, bounce: 380, visits: 380 },
  { dataKey: '2024-05-09', desktop: 227, mobile: 180, bounce: 390, visits: 390 },
  { dataKey: '2024-05-10', desktop: 293, mobile: 330, bounce: 400, visits: 400 },
  { dataKey: '2024-05-11', desktop: 335, mobile: 270, bounce: 410, visits: 410 },
  { dataKey: '2024-05-12', desktop: 197, mobile: 240, bounce: 420, visits: 420 },
  { dataKey: '2024-05-13', desktop: 197, mobile: 160, bounce: 430, visits: 430 },
  { dataKey: '2024-05-14', desktop: 448, mobile: 490, bounce: 440, visits: 440 },
  { dataKey: '2024-05-15', desktop: 473, mobile: 380, bounce: 450, visits: 450 },
  { dataKey: '2024-05-16', desktop: 338, mobile: 400, bounce: 460, visits: 460 },
  { dataKey: '2024-05-17', desktop: 499, mobile: 420, bounce: 470, visits: 470 },
  { dataKey: '2024-05-18', desktop: 315, mobile: 350, bounce: 480, visits: 480 },
  { dataKey: '2024-05-19', desktop: 235, mobile: 180, bounce: 490, visits: 490 },
  { dataKey: '2024-05-20', desktop: 177, mobile: 230, bounce: 500, visits: 500 },
  { dataKey: '2024-05-21', desktop: 82, mobile: 140, bounce: 510, visits: 510 },
  { dataKey: '2024-05-22', desktop: 81, mobile: 120, bounce: 520, visits: 520 },
  { dataKey: '2024-05-23', desktop: 252, mobile: 290, bounce: 530, visits: 530 },
  { dataKey: '2024-05-24', desktop: 294, mobile: 220, bounce: 540, visits: 540 },
  { dataKey: '2024-05-25', desktop: 201, mobile: 250, bounce: 550, visits: 550 },
  { dataKey: '2024-05-26', desktop: 213, mobile: 170, bounce: 560, visits: 560 },
  { dataKey: '2024-05-27', desktop: 420, mobile: 460, bounce: 570, visits: 570 },
  { dataKey: '2024-05-28', desktop: 233, mobile: 190, bounce: 580, visits: 580 },
  { dataKey: '2024-05-29', desktop: 78, mobile: 130, bounce: 590, visits: 590 },
  { dataKey: '2024-05-30', desktop: 340, mobile: 280, bounce: 600, visits: 600 },
  { dataKey: '2024-05-31', desktop: 178, mobile: 230, bounce: 610, visits: 610 },
  { dataKey: '2024-06-01', desktop: 178, mobile: 200, bounce: 620, visits: 620 },
  { dataKey: '2024-06-02', desktop: 470, mobile: 410, bounce: 630, visits: 630 },
  { dataKey: '2024-06-03', desktop: 103, mobile: 160, bounce: 640, visits: 640 },
  { dataKey: '2024-06-04', desktop: 439, mobile: 380, bounce: 650, visits: 650 },
  { dataKey: '2024-06-05', desktop: 88, mobile: 140, bounce: 660, visits: 660 },
  { dataKey: '2024-06-06', desktop: 294, mobile: 250, bounce: 670, visits: 670 },
  { dataKey: '2024-06-07', desktop: 323, mobile: 370, bounce: 680, visits: 680 },
  { dataKey: '2024-06-08', desktop: 385, mobile: 320, bounce: 690, visits: 690 },
  { dataKey: '2024-06-09', desktop: 438, mobile: 480, bounce: 700, visits: 700 },
  { dataKey: '2024-06-10', desktop: 155, mobile: 200, bounce: 710, visits: 710 },
  { dataKey: '2024-06-11', desktop: 92, mobile: 150, bounce: 720, visits: 720 },
  { dataKey: '2024-06-12', desktop: 492, mobile: 420, bounce: 730, visits: 730 },
  { dataKey: '2024-06-13', desktop: 81, mobile: 130, bounce: 740, visits: 740 },
  { dataKey: '2024-06-14', desktop: 426, mobile: 380, bounce: 750, visits: 750 },
  { dataKey: '2024-06-15', desktop: 307, mobile: 350, bounce: 760, visits: 760 },
  { dataKey: '2024-06-16', desktop: 371, mobile: 310, bounce: 770, visits: 770 },
  { dataKey: '2024-06-17', desktop: 475, mobile: 520, bounce: 780, visits: 780 },
  { dataKey: '2024-06-18', desktop: 107, mobile: 170, bounce: 790, visits: 790 },
  { dataKey: '2024-06-19', desktop: 341, mobile: 290, bounce: 800, visits: 800 },
  { dataKey: '2024-06-20', desktop: 408, mobile: 450, bounce: 810, visits: 810 },
  { dataKey: '2024-06-21', desktop: 169, mobile: 210, bounce: 820, visits: 820 },
  { dataKey: '2024-06-22', desktop: 317, mobile: 270, bounce: 830, visits: 830 },
  { dataKey: '2024-06-23', desktop: 480, mobile: 530, bounce: 840, visits: 840 },
  { dataKey: '2024-06-24', desktop: 132, mobile: 180, bounce: 850, visits: 850 },
  { dataKey: '2024-06-25', desktop: 141, mobile: 190, bounce: 860, visits: 860 },
  { dataKey: '2024-06-26', desktop: 434, mobile: 380, bounce: 870, visits: 870 },
  { dataKey: '2024-06-27', desktop: 448, mobile: 490, bounce: 880, visits: 880 },
  { dataKey: '2024-06-28', desktop: 149, mobile: 200, bounce: 890, visits: 890 },
  { dataKey: '2024-06-29', desktop: 103, mobile: 160, bounce: 900, visits: 900 },
  { dataKey: '2024-06-30', desktop: 446, mobile: 400, bounce: 910, visits: 910 },
]

const chartConfig = {
  views: {
    label: 'Page Views',
  },
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-2)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-3)',
  },
  visits: {
    label: 'Total Visits',
    color: 'var(--chart-4)',
  },
  bounce: {
    label: 'Bounce Rate',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

export function MultiTabBarChart<T extends { dataKey: string }>({ title, description, data = exemplaryChartData as Any }: { title: string; description?: string; data?: ChartData<T>[] }) {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>('desktop')

  const chartTabs = React.useMemo(() => getKeys(data[0]).filter((key) => key !== 'dataKey'), [data])

  const total = React.useMemo(() => {
    const keySums: { [key: string]: string | number } = {}

    chartTabs.forEach((tab) => {
      const total: number = data.reduce((acc, curr: Any) => acc + (curr?.[tab] ?? 0), 0)

      let sum: string | number = total
      if (total > 1_000_000) sum = `${(total / 1_000_000).toFixed(2)}M`
      else if (total > 1_000) sum = `${(total / 1000).toFixed(1)}k`

      keySums[tab as string] = sum
    })

    return keySums
  }, [chartTabs, data])

  return (
    <Card className='@container'>
      <CardHeader className='flex flex-col items-stretch gap-2 !p-0'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 pb-3'>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className='mx-4 flex flex-wrap justify-evenly gap-2 overflow-hidden @xl:flex-nowrap @2xl:gap-4 @4xl:gap-2'>
          {chartTabs.map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className='data-[active=true]:bg-accent/40 relative z-30 flex max-w-sm flex-col justify-center gap-1 rounded-md p-2 text-left @3xl:gap-2 @3xl:p-4'
                onClick={() => setActiveChart(chart)}>
                <span className='text-muted-foreground text-center text-sm in-data-[active=true]:text-blue-400 @3xl:text-base dark:in-data-[active=true]:text-blue-500'>
                  {chartConfig[chart].label}
                </span>
                <div className='flex items-center justify-between gap-2 @3xl:gap-4'>
                  <span className='text-base leading-none font-bold @3xl:text-xl'>{total[key]}</span>
                  <Badge
                    className={cn(
                      'flex items-center gap-1 text-[10px] @3xl:h-6.5 @3xl:text-xs [&>svg]:size-3.5',
                      // eslint-disable-next-line require-color-modes/require-color-mode-styles
                      'bg-green-50 text-green-700 dark:bg-[oklch(37%_0.05_161)] dark:text-[oklch(73%_0.19_151)]',
                    )}>
                    <ArrowUpRightIcon className='' />
                    12.8%
                  </Badge>
                </div>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        <ChartContainer config={chartConfig} className='aspect-auto h-[250px] w-full'>
          <BarChart
            accessibilityLayer
            key={activeChart} // re-animate appearance when switching between tabs
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='dataKey'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey='views'
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
