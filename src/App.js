import React, { lazy, Suspense } from 'react'
import Footer from './UI/Footer'
import Header from './UI/Header'
import logo from './assets/images/logo-horizontal.png'
import './styles/App.css'
import { SpinnerCircular } from 'spinners-react'

const SessionCountdownTimers = lazy(() => import('./UI/SessionCountdownTimer'))

// const SessionCountdownTimers = lazy(() => {
// 	return new Promise(resolve => {
// 		setTimeout(() => resolve(import("./UI/SessionCountdownTimer")), 3000000);
// 	});
// });

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
