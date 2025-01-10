import {
  createBrowserRouter,
  Route,
  RouterProvider,
  createRoutesFromElements
} from "react-router-dom"
import AuthPage from "./pages/AuthPage";
import DashboardLayout from "./layouts/DashboardLayout";
import ManagerDashboard from "./pages/ManagerDashboard";
import PantryDashboard from "./pages/PantryDashboard";

function App() {
  document.title = "Hospital Food Delivery System";
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<AuthPage/>}/>
        <Route path="/manager" element={<DashboardLayout/>}>
          <Route index element={<ManagerDashboard/>}/>
        </Route>
        <Route path="/pantry" element={<DashboardLayout/>}>
          <Route index element={<PantryDashboard/>}/>
        </Route>
      </>
    )
  )
  return (
    <RouterProvider router={router} />
  )
}

export default App
