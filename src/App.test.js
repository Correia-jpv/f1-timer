import { render, screen } from '@testing-library/react'
import App from './App'

test('Check heading', () => {
  render(<App />)
  const headingElement = screen.getByText(/Weekly reset/i)
  expect(headingElement).toBeInTheDocument()
})
