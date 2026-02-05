'use client'

import { usePrevious, useWindowSize } from '@uidotdev/usehooks'
import { Area, AreaChart, CartesianGrid, Legend, Margin, XAxis, YAxis } from 'recharts'

export default function ExampleAreaChart() {
  const size = useWindowSize()
  const previous = usePrevious(size)
  const hasResized = () => {
    // initial load
    if (!previous || !previous.height || !previous.width) return false

    return true
  }

  const margin: Margin = {
    left: 0,
    right: 0,
    bottom: 10,
    top: 10,
  }

  return (
    <AreaChart
      responsive
      className=''
      accessibilityLayer
      barCategoryGap='10%'
      barGap={4}
      data={[
        {
          amt: 1400,
          name: 'Page A',
          pv: 800,
          uv: 590,
        },
        {
          amt: 1400,
          name: 'Page B',
          pv: 800,
          uv: 590,
        },
        {
          amt: 1506,
          name: 'Page C',
          pv: 967,
          uv: 868,
        },
        {
          amt: 989,
          name: 'Page D',
          pv: 1098,
          uv: 1397,
        },
        {
          amt: 1228,
          name: 'Page E',
          pv: 1200,
          uv: 1480,
        },
        {
          amt: 1100,
          name: 'Page F',
          pv: 1108,
          uv: 1520,
        },
        {
          amt: 1700,
          name: 'Page G',
          pv: 680,
          uv: 4400,
        },
      ]}
      layout='horizontal'
      margin={margin}
      style={{
        width: '100%',
      }}
      syncMethod='index'>
      <CartesianGrid strokeDasharray='3 3' className='dark:stroke-neutral-500' />
      <XAxis dataKey='name' />
      <YAxis width={'auto'} />
      <Area animationBegin={0} isAnimationActive={!hasResized()} dataKey='uv' fill='rgba(136,132,216,0.47)' stackId='1' stroke='#8884d8' strokeWidth={3} type='monotone' />
      <Area animationBegin={300} isAnimationActive={!hasResized()} dataKey='pv' fill='rgba(130,202,157,0.47)' stackId='1' stroke='#82ca9d' strokeWidth={3} type='monotone' />
      <Area animationBegin={600} isAnimationActive={!hasResized()} dataKey='amt' fill='rgba(255,198,88,0.47)' stackId='1' stroke='#ffc658' strokeWidth={3} type='monotone' />
      <Legend align='center' width={'stretch'} wrapperStyle={{ left: margin.left, right: margin.right }} />
    </AreaChart>
  )
}
