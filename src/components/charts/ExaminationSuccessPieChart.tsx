/* eslint-disable react-hooks/purity */
'use client'

import React from 'react'
import { Label, Pie, PieChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/shadcn/card'
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/src/components/shadcn/chart'
import { useScopedI18n } from '@/src/i18n/client-localization'

export function ExaminationSuccessPieChart({ title, description }: { title: string; description?: string }) {
  const t = useScopedI18n('Checks.ExaminatonResults.Charts.ExaminationSuccessPieChart')
  const total = Math.max(Math.round(Math.random() * 150), Math.round(Math.max(48, Math.random() * 120)))
  const passedRate = Math.min(0.95, Math.max(0.6, Math.random()))

  const passedCount = Math.round(total * passedRate)
  const failedCount = total - passedCount

  const data = [
    // { type: 'pass', count: users.filter((u) => !u.isAnonymous).length, fill: 'var(--color-pass)' },
    // { type: 'fail', count: users.filter((u) => u.isAnonymous).length, fill: 'var(--color-fail)' },
    { type: 'pass', count: passedCount, fill: 'var(--color-pass)' },
    { type: 'fail', count: failedCount, fill: 'var(--color-fail)' },
  ]

  const chartConfig = React.useMemo(
    (): ChartConfig => ({
      pass: {
        // label: 'Passed Examination',
        label: t('passed_label'),
        color: 'var(--chart-2)',
      },
      fail: {
        // label: 'Failed Examination',
        label: t('failed_label'),
        color: 'var(--chart-5)',
      },
    }),
    [],
  )

  const totalUsers = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0)
  }, [data])

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-[250px]'>
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item, index) => {
                    return (
                      <div className='flex flex-col gap-1'>
                        <div className='flex flex-col gap-1.5'>
                          <div className='flex items-center justify-between gap-4'>
                            <div className='flex items-center gap-2'>
                              <div
                                className='size-2.5 shrink-0 rounded-[2px] bg-(--color-bg)'
                                style={
                                  {
                                    '--color-bg': `var(--color-${name})`,
                                  } as React.CSSProperties
                                }
                              />
                              {chartConfig[name as keyof typeof chartConfig]?.label || name}
                            </div>
                            <div className='text-foreground flex flex-1 items-baseline justify-end gap-1 text-right font-mono font-medium tabular-nums'>
                              {value}
                              <span className='text-muted-foreground font-normal lowercase'>{t('inner_label', { count: +value })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }}
                />
              }
            />
            <Pie data={data} dataKey='count' nameKey='type' innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                        <tspan x={viewBox.cx} y={viewBox.cy} className='fill-foreground text-3xl font-bold'>
                          {totalUsers.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className='fill-muted-foreground capitalize'>
                          {t('inner_label', { count: totalUsers })}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey='type' />} className='-translate-y-2 flex-wrap gap-6 *:basis-1/4 *:justify-center' />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
