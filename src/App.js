import React, { lazy, Suspense } from 'react'
import Footer from './layout/Footer/Footer'
import Header from './layout/Header/Header'
import logo from './assets/images/logo-horizontal.png'
import './styles/App.css'
import { SpinnerCircular } from 'spinners-react'

const SessionCountdownTimers = lazy(() => import('./components/SessionCountdownTimer'))

const App = () => {
  return [
    <Header logo={logo} />,
    <Suspense fallback={<SpinnerCircular size={'30vh'} color={'grey'} secondaryColor={'transparent'} style={{ margin: 'auto' }} />}>
      <SessionCountdownTimers />
    </Suspense>,
    <Footer />,
  ]
}

export default App
