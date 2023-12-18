import {
  createHashRouter
} from "react-router-dom";
import App from "./app";
import About from "./pages/about";
import Instructions from "./pages/instructions";
import Loader from "./pages/loader";
import Settings from "./pages/settings";
import Dashboard from './pages/dashboard'

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/instructions",
        element: <Instructions />,
      },
      {
        path: "/loader",
        element: <Loader />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ]
  },
]);

export default router
