import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from './components/Home'
import { UserContextProvider } from "./userContext";
import UserRoleChecker from "./components/UserRoleChecker";

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
                  </Routes>
              </UserContextProvider>
          </Router>
      </>
  );
}

export default App;
