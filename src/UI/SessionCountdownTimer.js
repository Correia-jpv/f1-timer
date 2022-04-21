import React, { useState, useEffect, useRef } from 'react'

import CountdownTimer from './CountdownTimer'

const renderSchema = (weekly, daily) => {
  return (
    <script type="application/ld+json">
      {`
      {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "When is the Lost Ark EU/US servers weekly reset?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${weekly}"
      }
    },
    {
      "@type": "Question",
      "name": "When is the Lost Ark EU/US servers daily reset?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${daily}"
      }
    }
  ]
}
`}
    </script>
  )
}

const renderTitle = (title) => {
  return <h2 className="text-center">{title}</h2>
}

const getGranPrixTitle = (granPrix) => granPrix['name'] + (granPrix['name'].toLowerCase().includes('gran prix') ? ' Gran Prix' : '') + ' in ' + granPrix['location']

const getUTC = (date = new Date()) => Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())

const getUTCString = (date) =>
  new Intl.DateTimeFormat('default', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).format(new Date(date))

const getLocalString = (date) => {
  const localLocale = Intl.DateTimeFormat().resolvedOptions().locale,
    localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return new Intl.DateTimeFormat(localLocale, {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: localTimezone,
    timeZoneName: 'short',
  }).format(new Date(date))
}

const SessionCountdownTimers = () => {
  const [status, setStatus] = useState('')
  const [granPrixes, setGranPrixes] = useState([])
  const [countdownEndTime, setCountdownEndTime] = useState(new Date())
  const granPrix = useRef('')

  const today = new Date(),
    racesURL = 'https://raw.githubusercontent.com/sportstimes/f1/main/_db/f1/' + today.getFullYear().toString() + '.json'

  useEffect(() => {
    setStatus('Loading')
    fetch(racesURL)
      .then((response) => response.json())
      .then(setGranPrixes)
      .then(() => setStatus('Loaded'))
      .catch(() => setStatus('Error'))
  }, [])

  useEffect(() => {
    if (status === 'Loaded') {
      if (granPrixes['races'].length > 0) {
        const upcomingRaces = granPrixes['races'].filter((race) => new Date(race['sessions']['gp']).getTime() > today)
        granPrix.current = granPrixes['races'].find((race) => new Date(race['sessions']['gp']).getTime() > today)

        if (granPrix.current !== undefined) {
          setCountdownEndTime(new Date(granPrix.current['sessions']['gp']))
          setStatus('Success')
        } else setStatus('No races')
      }
    }
  }, [status])

  const sessionButtonHandler = (event, sessionName) => {
    setCountdownEndTime(new Date(granPrix.current['sessions'][sessionName]))

    Array.from(document.querySelectorAll('.pure-button.active')).forEach((el) => el.classList.remove('active'))
    event.target.classList.add('active')
  }

  return (
    <>
      {status === 'Success' && [
        <>
          {renderTitle(getGranPrixTitle(granPrix.current))}
          <div className="text-center" style={{ whiteSpace: 'break-spaces' }}>
            {status === 'Success' && [
              Object.keys(granPrix.current['sessions']).map((key, index) => (
                <>
                  <button
                    onClick={(e) => sessionButtonHandler(e, key)}
                    className={'pure-button' + (key === 'gp' ? ' active' : '')}
                    style={{ fontSize: '1.1em', textTransform: 'uppercase', marginBottom: '1em' }}
                  >
                    {key}
                  </button>
                  &nbsp;
                </>
              )),
            ]}
          </div>
          {countdownEndTime && [<CountdownTimer startTime={getUTC()} endTime={countdownEndTime} utcString={getUTCString(countdownEndTime)} localString={getLocalString(countdownEndTime)} />]}
        </>,
      ]}
      {status === 'No races' && renderTitle("It's offseason 😥")}
    </>
  )
}

export default SessionCountdownTimers
