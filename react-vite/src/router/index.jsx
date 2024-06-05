import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
// import ServerDetails from '../components/Servers/ServerDetails';
import Layout from './Layout';
import MainComponent from '../components/Main/Main';

import AllChannels from '../components/Channels/Channels';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <MainComponent/>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },

      // {
      //   path: "/servers/:serverId",
      //   element: <ServerDetails />,
      // },

      {
        path: "/channels/:channelId",
        element: <AllChannels />,
      },
    ],
  },
]);
