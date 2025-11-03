import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Users from "./pages/Users/Users";
import Weddings from "./pages/Weddings/Weddings";
import Feedback from "./pages/Feedback";
import Login from "./pages/Auth/Login";
import "./styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="weddings" element={<Weddings />} />
              <Route
                path="payments"
                element={<div>Thanh toán (Coming soon)</div>}
              />
              <Route
                path="analytics"
                element={<div>Thống kê (Coming soon)</div>}
              />
              <Route
                path="settings"
                element={<div>Cài đặt (Coming soon)</div>}
              />
              <Route path="feedbacks" element={<Feedback />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
