import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./stores/store";
import HomePage from "./pages/HomePage";
import NavBar from "./pages/NavBar";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import PianoSetupPage from "./pages/PianoProfileSetupPage";
import PianoKeySetupPage from "./pages/PianoKeySetupPage";
import PianoHomePage from "./pages/PianoHomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    errorElement: "ErrorPage",
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/pianoSetup", element: <PianoSetupPage /> },
      { path: "/pianoKeySetup/:pianoId", element: <PianoKeySetupPage /> },
      { path: "/pianoHomePage/:pianoId", element: <PianoHomePage /> },
    ],
  },
]);

function App() {
  return (
    <>
      <Provider store={store}>
        {/* Loading is what the user is shown while the data rehydrates */}
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
