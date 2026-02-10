'use client'
import { usePrevious, useWindowSize } from '@uidotdev/usehooks'
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
  const size = useWindowSize()
  const previous = usePrevious(size)
  const hasResized = () => {
    // initial load
    if (!previous || !previous.height || !previous.width) return false

    return true
  }

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

  //* Margin type is not exported by recharts @^2.0.0, but is accessbile in @^3.0.0
  type Margin = {
    left?: number
    right?: number
    bottom?: number
    top?: number
  }

  const margin: Margin = {
    left: 0,
    right: 0,
    bottom: 10,
    top: 10,
  }

  return (
    <LineChart
      // responsive  // is not exported by recharts @^2.0.0, but is accessbile in @^3.0.0
      style={{ width: '100%', aspectRatio: 1.418 }}
      margin={margin}
      data={data}
      className='*:[svg]:outline-none'>
      <CartesianGrid className='dark:stroke-neutral-500' />
      <XAxis dataKey='name' />
      <YAxis />
      {/* `width` property does not exist in recharts @^2.0.0, but does in @^3.0.0  */}
      {/* <YAxis width={'auto'} /> */}
      <Legend align='center' wrapperStyle={{ left: margin.left, right: margin.right }} />
      {/* `width` property does not exist in recharts @^2.0.0, but does in @^3.0.0  */}
      {/* <Legend align='center' wrapperStyle={{ left: margin.left, right: margin.right }} /> */}

      <Tooltip content={CustomTooltip} />

      <Line dataKey='value' isAnimationActive={!hasResized()} stroke='green' strokeWidth={2} />
      <Line dataKey='userA' isAnimationActive={!hasResized()} stroke='orange' strokeWidth={2} />
      <Line dataKey='userB' isAnimationActive={!hasResized()} stroke='lightblue' strokeWidth={2} />
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
