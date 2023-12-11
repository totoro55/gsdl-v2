import {
  createHashRouter
} from "react-router-dom";
import App from "./app";
import About from "./pages/about";
import Instructions from "./pages/instructions";
import Loader from "./pages/loader";
import Settings from "./pages/settings";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
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
