/* eslint-disable react-hooks/purity */

'use client'
import React from 'react'
import { Label, Pie, PieChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/shadcn/card'
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/src/components/shadcn/chart'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { BetterAuthUser } from '@/src/lib/auth/server'

export function UserTypePieChart({ title, description }: { title: string; description?: string; users?: BetterAuthUser[] }) {
  const t = useScopedI18n('Checks.ExaminatonResults.Charts.UserTypePieChart')
  const total = Math.max(Math.round(Math.random() * 150), Math.round(Math.max(48, Math.random() * 120)))
  const normalRate = Math.min(0.95, Math.max(0.6, Math.random()))

  const normalCount = Math.min(Math.round(total * normalRate), total * 0.85)
  const anonymousCount = total - normalCount

  const data = [
    // real-data
    // { type: 'normal', count: users.filter((u) => !u.isAnonymous).length, fill: 'var(--color-normal)' },
    // { type: 'anonymous', count: users.filter((u) => u.isAnonymous).length, fill: 'var(--color-anonymous)' },

    // dummy-data
    { type: 'normal', count: normalCount, fill: 'var(--color-normal)' },
    { type: 'anonymous', count: anonymousCount, fill: 'var(--color-anonymous)' },
  ]

  const chartConfig = React.useMemo(
    (): ChartConfig => ({
      normal: {
        label: t('user_type_normal'),
        color: 'var(--chart-3)',
      },
      anonymous: {
        label: t('user_type_anonynmous'),
        color: 'var(--chart-1)',
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey='count' nameKey='type' innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                        <tspan x={viewBox.cx} y={viewBox.cy} className='fill-foreground text-3xl font-bold'>
                          {totalUsers.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className='fill-muted-foreground'>
                          {t('inner_label')}
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
