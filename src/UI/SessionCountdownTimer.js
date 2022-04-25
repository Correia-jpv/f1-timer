import React, { useState, useEffect } from 'react'

import CountdownTimer from './CountdownTimer'
import Select from 'react-select'

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

const renderTitle = (title) => <h2 className="text-center">{title}</h2>

const getGranPrixTitle = (granPrix) => granPrix['name'] + (!granPrix['name'].toLowerCase().includes('gran prix') ? ' Gran Prix' : '') + ' in ' + granPrix['location']

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
  const [granPrix, setGranPrix] = useState(undefined)

  const today = new Date(),
    racesURL = 'https://raw.githubusercontent.com/sportstimes/f1/main/_db/f1/' + today.getFullYear().toString() + '.json'

  useEffect(() => {
    setStatus('Loading')
    fetch(racesURL)
      .then((response) => response.json())
      .then((data) => {
        const upcomingRaces = data['races'].filter((race) => new Date(race['sessions']['gp']).getTime() > today)
        setGranPrixes(upcomingRaces)
      })
      .then(() => setStatus('Loaded'))
      .catch(() => setStatus('Error'))
  }, [])

  useEffect(() => {
    if (status === 'Loaded' && granPrixes.length > 0) {
      const currentGranPrix = granPrixes.find((gp) => new Date(gp['sessions']['gp']).getTime() > today)
      if (currentGranPrix !== undefined) {
        setGranPrix(currentGranPrix)
        setStatus('Success')
      } else setStatus('No races')
    }
  }, [status])

  useEffect(() => {
    if (status === 'Success') setCountdownEndTime(new Date(granPrix['sessions']['gp']))
  }, [granPrix])

  const renderGranPrixSelect = () => {
    let elSelectOptions = []
    granPrixes.forEach((gp) => {
      elSelectOptions.push({ value: gp['name'], label: getGranPrixTitle(gp) })
    })

    return [
      <div className="pure-g">
        <div className="pure-u-1">
          <Select
            options={elSelectOptions}
            onChange={(value) => setGranPrix(granPrixes.find((gp) => gp['name'] === value.value))}
            defaultValue={elSelectOptions.find((gp) => gp['value'] === granPrix['name'])}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: 'white',
                primary: '#e10600',
                neutral80: 'white',
              },
            })}
            styles={{
              control: (provided, state) => ({
                ...provided,
                background: 'transparent',
                border: '0',
                cursor: 'pointer',
                fontSize: '1.4em',
                fontFamily: "'Formula1-Bold', 'Fira Sans', Verdana, sans-serif",
              }),
              indicatorSeparator: (provided, state) => ({
                ...provided,
                display: 'none',
              }),
              menu: (provided, state) => ({
                ...provided,
                backgroundColor: '#141312',
                border: '1px solid #262626',
              }),
              option: (provided, state) => ({
                ...provided,
                color: state.isSelected ? 'white' : '#b5b5b5',
                ':hover': !state.isSelected
                  ? {
                      color: '#141312',
                    }
                  : {},
                cursor: 'pointer',
              }),
            }}
          />
        </div>
      </div>,
    ]
  }

  const sessionButtonHandler = (event, sessionName) => {
    setCountdownEndTime(new Date(granPrix['sessions'][sessionName]))

    Array.from(document.querySelectorAll('.pure-button.active')).forEach((el) => el.classList.remove('active'))
    event.target.classList.add('active')
  }

  return (
    <>
      {status === 'Success' &&
        granPrix && [
          <>
            {renderGranPrixSelect()}
            <div className="text-center" style={{ whiteSpace: 'break-spaces' }}>
              {[
                Object.keys(granPrix['sessions']).map((key, index) => (
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
            {(granPrix || countdownEndTime) && [
              <CountdownTimer startTime={getUTC()} endTime={countdownEndTime} utcString={getUTCString(countdownEndTime)} localString={getLocalString(countdownEndTime)} />,
            ]}
          </>,
        ]}
      {status === 'No races' && renderTitle("It's offseason 😥")}
    </>
  )
}

export default SessionCountdownTimers
