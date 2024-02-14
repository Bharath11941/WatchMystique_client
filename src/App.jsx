import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import UserRoute from "./routes/UserRoute";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<UserRoute />} />
        
      </Routes>
      <div className="fixed">
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
