
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import router from './routes'
import { useLocation } from 'react-router-dom';

function App() {

  

  return (
  <>
 <ToastContainer/>
 <RouterProvider router={router}/>
  </>
  )
}

export default App
