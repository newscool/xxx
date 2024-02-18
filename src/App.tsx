import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import Layout from './components/layout';
import Home from './routes/home';
import Profile from './routes/profile';
import Login from './routes/login';
import CreateAccount from './routes/create-account';
import { useEffect, useState } from 'react';
import LoadingScreen from './components/loading-screen';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/create-accout',
    element: <CreateAccount />,
  },
]);

function App() {
  const [isLoading, setLoading] = useState(true);

  const init = async () => {
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return <>{isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}</>;
}

export default App;
