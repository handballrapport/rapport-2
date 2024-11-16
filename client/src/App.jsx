import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomeLayout from "./pages/HomeLayout";
import Error from "./pages/Error";
import Teams from "./pages/Teams";
import TeamDetail from "./components/TeamDetail"; // Import the new TeamDetail component
import DashboardLayout from "./pages/DashboardLayout";
import Competition from './pages/Competition';
import Events from './pages/Events';
import LiveEvents from "./pages/LiveEvents";
import Reports from "./pages/Reports";
import Games from "./pages/Games";
import { Toaster } from 'react-hot-toast';
import LandingPage from "./pages/LandingPage";

// Dashboard Routes
const dashboardRoutes = {
  path: "dashboard",
  element: <DashboardLayout />,
  children: [
    { index: true, element: <Competition /> }, // Set Competition as the index page of the dashboard
    { path: "teams", element: <Teams /> }, // No nested routes here
    { path: "teams/:id/:team", element: <TeamDetail /> }, // Separate route for team details
    { path: "competition", element: <Competition /> },
    { path: "events", element: <Events /> },
    { path: "live-events", element: <LiveEvents /> },
    { path: "reports", element: <Reports /> },
    { path: "games", element: <Games /> },
  ],
};

// Main Routes
const mainRoutes = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <LandingPage/> },
      dashboardRoutes, 
    ],
  },
];

const router = createBrowserRouter(mainRoutes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" reverseOrder={false}  />
    </>
  );
}

export default App;
