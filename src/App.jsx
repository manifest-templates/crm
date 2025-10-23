import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Monetization from './components/monetization/Monetization'
import AppLayout from './components/AppLayout'
import Dashboard from './components/Dashboard'
import CustomerList from './components/CustomerList'
import AddCustomer from './components/AddCustomer'
import CustomerDetail from './components/CustomerDetail'
import { ThemeProvider } from './contexts/ThemeContext'
import { getRouterBasename } from './utils/routerUtils'

function App() {

  return (
    <ThemeProvider>
      <Monetization>
        <Router basename={getRouterBasename()}>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/customers/add" element={<AddCustomer />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
            </Routes>
          </AppLayout>
        </Router>
      </Monetization>
    </ThemeProvider>
  )
}

export default App