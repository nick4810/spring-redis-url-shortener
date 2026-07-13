import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import ShortenForm from './components/ShortenForm'
import StatsView from './components/StatsView'

export default function App() {
  return (
    <BrowserRouter>
      <header>
        <h1>URL Shortener</h1>
        <nav>
          <NavLink to="/">Shorten</NavLink>
          <NavLink to="/stats">Stats</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ShortenForm />} />
          <Route path="/stats" element={<StatsView />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
