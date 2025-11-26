import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './ReduxToolkit/store.js'
import { ToastProvider } from './Toast/ToastProvider.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <ToastProvider>
    <App />
  </ToastProvider>
  </Provider>
)
