import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import ServerDetails from '../components/Servers/ServerDetails';
import CreateServerForm from '../components/CreateServerForm';
import ServerDetails from '../components/Servers/ServerDetails'
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Navigation/>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },

      {
        path: "/servers/:serverId",
        element: <ServerDetails />,
      },

      {
        path: "servers",
        element: <CreateServerForm />
      }
    ],
  },
]);
