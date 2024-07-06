import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from './components/Home'
import { UserContextProvider } from "./userContext";
import UserRoleChecker from "./components/UserRoleChecker";
import SignUp from "./components/SignUp";

function App() {

  return (
      <>
          <Router>
              <UserContextProvider>
                  <Routes>
                      <Route
                          exact
                          path="/"
                          element={<Home />}
                      />
                      <Route
                          exact
                          path="/in"
                          element={<UserRoleChecker />}
                      />
                      <Route
                          exact
                          path="/signup"
                          element={<SignUp />}
                      />
                  </Routes>
              </UserContextProvider>
          </Router>
      </>
  );
}

export default App;
