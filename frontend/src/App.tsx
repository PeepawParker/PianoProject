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
import PianoPracticePage from "./pages/PianoPracticePage";

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
      { path: "/pianoHome/:pianoId", element: <PianoHomePage /> },
      { path: "/pianoPractice/:pianoId", element: <PianoPracticePage /> },
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
