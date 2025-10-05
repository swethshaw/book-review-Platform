import { useState } from 'react'
import './App.css'
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
function App() {
  useEffect(() => {
    if (localStorage.getItem("id") && localStorage.getItem("token")) {
      dispatch(authActions.login());
    } else if (
      isLoggedIn === false &&
      window.location.pathname !== "/verify-email"
    ) {
      navigate("/login");
    }
  }, []);
return (
    <div className="bg-gray-900 text-white md:h-[100%] p-2 relative">
      <Routes>
        <Route exact path="/" element={<Home />}>
          <Route index element={<AllTasks />} />
          <Route path="/importantTasks" element={<ImportantTasks />} />
          <Route path="/completedTasks" element={<CompletedTasks />} />
          <Route path="/incompletedTasks" element={<IncompletedTasks />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App
