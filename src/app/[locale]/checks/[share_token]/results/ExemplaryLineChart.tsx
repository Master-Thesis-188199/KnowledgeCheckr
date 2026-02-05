'use client'
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { Any } from '@/types'

// #region Sample data
const data = [
  {
    name: 'Page A',
    uv: 400,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 300,
    pv: 4567,
    amt: 2400,
  },
  {
    name: 'Page C',
    uv: 320,
    pv: 1398,
    amt: 2400,
  },
  {
    name: 'Page D',
    uv: 200,
    pv: 9800,
    amt: 2400,
  },
  {
    name: 'Page E',
    uv: 278,
    pv: 3908,
    amt: 2400,
  },
  {
    name: 'Page F',
    uv: 189,
    pv: 4800,
    amt: 2400,
  },
]

export default function ExemplaryLineChart() {
  type Data = {
    name: string
    measurements: number[]
    value: number
    userA: number
    userB: number
  }

  const data: Data[] = [
    {
      name: 'Question 1',
      value: 10,
      userA: 1,
      userB: 10,
      measurements: [1, 2, 3, 4, 5, 6],
    },
    {
      name: 'Question 2',
      value: 5,
      userA: 2,
      userB: 9,
      measurements: [2, 1, 3, 3, 7, 6],
    },
    {
      name: 'Question 3',
      value: 12,
      userA: 3,
      userB: 8,
      measurements: [1, 2, 3, 4, 5, 6],
    },
    {
      name: 'Question 4',
      value: 7,
      userA: 4,
      userB: 7,
      measurements: [1, 2, 3, 4, 5, 6],
    },
    {
      name: 'Question 5',
      userA: 5,
      value: 9,
      userB: 7,
      measurements: [1, 2, 3, 4, 5, 6],
    },
    {
      name: 'Question 6',
      userA: 6,
      userB: 6,
      measurements: [1, 2, 3, 4, 5, 6],
      value: 13,
    },
  ]

  return (
    <LineChart
      style={{ width: '100%', aspectRatio: 1.618 }}
      margin={{
        bottom: 10,
        left: 0,
        right: 40,
        top: 10,
      }}
      data={data}
      className='*:[svg]:outline-none'>
      <CartesianGrid className='dark:stroke-neutral-500' />
      <XAxis dataKey='name' />
      <YAxis />
      <Legend align='center' width={'100%'} />

      <Tooltip content={CustomTooltip} />

      <Line dataKey='value' stroke='green' strokeWidth={2} />
      <Line dataKey='userA' stroke='orange' strokeWidth={2} />
      <Line dataKey='userB' stroke='lightblue' strokeWidth={2} />
    </LineChart>
  )
}

function CustomTooltip({ payload, label, active }: Any) {
  if (active && payload && payload.length) {
    return (
      <div className='bg-sidebar-accent ring-ring-focus dark:ring-ring-subtle rounded-md p-2 text-sm ring-1'>
        <p className='label' style={{ margin: '0', fontWeight: '700' }}>{`${label} : ${payload[0].value}`}</p>
        <p className='intro' style={{ margin: '0' }}>
          {label}
        </p>
        <p className='desc border-t-ring-focus border-t border-dashed'>Anything you want can be displayed here.</p>
      </div>
    )
  }

  return null
}
