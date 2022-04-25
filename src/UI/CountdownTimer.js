import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import React, { useState } from 'react'

const renderTime = (dimension, time) => {
  return (
    <div className="time-wrapper">
      <div className="time" style={{ fontSize: '3em' }}>
        {time}
      </div>
      <div>{dimension}</div>
    </div>
  )
}

const renderTimeSubtitle = (utc, local) => {
  return (
    <div className="pure-g">
      <div className="pure-u-1 pure-u-md-1-2 text-center text-md-end" style={{ whiteSpace: 'nowrap' }}>
        {local.toString()}
      </div>
      <div className="pure-u-1 pure-u-md-1-2 text-center text-md-start" style={{ whiteSpace: 'nowrap' }}>
        {utc.toString()}
      </div>
    </div>
  )
}

const RenderCountdown = (startTime, endTime) => {
  const timerProps = {
    isPlaying: true,
    size: 120,
    strokeWidth: 6,
    trailColor: '#404041',
  }

  const minuteSeconds = 60
  const hourSeconds = 3600
  const daySeconds = 86400

  const getTimeSeconds = (time) => (minuteSeconds - time) | 0
  const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0
  const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0
  const getTimeDays = (time) => (time / daySeconds) | 0

  const [remainingTime, setRemainingTime] = React.useState(endTime / 1000 - startTime / 1000)

  React.useEffect(() => {
    setRemainingTime(endTime / 1000 - startTime / 1000)
  }, [endTime])

  const days = Math.ceil(remainingTime / daySeconds)
  const daysDuration = days * daySeconds

  return (
    <>
      {remainingTime && (
        <div className="pure-g text-center center pb-2">
          <div className={'timer-wrapper pure-u-1 pure-u-sm-1-2 pure-u-lg-1-4' + (days <= 1 ? ' invisible' : '')}>
            <CountdownCircleTimer {...timerProps} key={remainingTime} colors={['#e10600']} initialRemainingTime={remainingTime} duration={daysDuration}>
              {({ elapsedTime, color }) => <span style={{ color, fontSize: '0.8em' }}>{renderTime('days', getTimeDays(daysDuration - elapsedTime))}</span>}
            </CountdownCircleTimer>
          </div>

          <div className="timer-wrapper pure-u-1 pure-u-sm-1-2 pure-u-lg-1-4">
            <CountdownCircleTimer
              {...timerProps}
              key={remainingTime}
              colors={['#FFFD19']}
              initialRemainingTime={remainingTime % daySeconds}
              duration={daySeconds}
              onComplete={(totalElapsedTime) => ({
                shouldRepeat: remainingTime - totalElapsedTime > hourSeconds,
              })}
            >
              {({ elapsedTime, color }) => <span style={{ color, fontSize: '0.8em' }}>{renderTime('hours', getTimeHours(daySeconds - elapsedTime))}</span>}
            </CountdownCircleTimer>
          </div>

          <div className="timer-wrapper pure-u-1 pure-u-sm-1-2 pure-u-lg-1-4">
            <CountdownCircleTimer
              {...timerProps}
              key={remainingTime}
              colors={['#FFF']}
              initialRemainingTime={remainingTime % hourSeconds}
              duration={hourSeconds}
              onComplete={(totalElapsedTime) => ({
                shouldRepeat: remainingTime - totalElapsedTime > minuteSeconds,
              })}
            >
              {({ elapsedTime, color }) => <span style={{ color, fontSize: '0.8em' }}>{renderTime('minutes', getTimeMinutes(hourSeconds - elapsedTime))}</span>}
            </CountdownCircleTimer>
          </div>

          <div className="timer-wrapper pure-u-1 pure-u-sm-1-2 pure-u-lg-1-4">
            <CountdownCircleTimer
              {...timerProps}
              key={remainingTime}
              colors={['#3BCD2A']}
              initialRemainingTime={remainingTime % minuteSeconds}
              duration={minuteSeconds}
              onComplete={(totalElapsedTime) => ({
                shouldRepeat: remainingTime - totalElapsedTime > 0,
              })}
            >
              {({ elapsedTime, color }) => <span style={{ color, fontSize: '0.8em' }}>{renderTime('seconds', getTimeSeconds(elapsedTime))}</span>}
            </CountdownCircleTimer>
          </div>
        </div>
      )}
    </>
  )
}

const CountdownTimer = (props) => [renderTimeSubtitle(props.utcString, props.localString), RenderCountdown(props.startTime, props.endTime)]

export default CountdownTimer
