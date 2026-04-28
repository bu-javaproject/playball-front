import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/MainPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);