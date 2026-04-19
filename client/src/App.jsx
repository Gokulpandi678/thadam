import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import ErrorBoundary from './ui/ErrorBoundary'
import { CustomerContextProvider } from './context/CustomerContext'
import {Toaster} from 'react-hot-toast'
import QueryProvider from "./service/QueryProvider"

function App() {

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Toaster position='top-center' reverseOrder={false}/>
        <QueryProvider>
          <CustomerContextProvider>
            <AppRoutes />
          </CustomerContextProvider>
        </QueryProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
