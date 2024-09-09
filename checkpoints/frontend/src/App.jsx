import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Checkpoint from "./components/Checkpoint";
import "./App.css";
import RegisterProduct from "./components/RegisterProduct";
import Panel from "./components/Admin/Panel";
import CheckpointData from "./components/Admin/CheckpointData";
import Navbar from "./components/Navigation/Navbar";

export default function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/register-product" element={<RegisterProduct />} />
          <Route path="/view-products" element={<Panel />} />
          <Route path="/products/checkpoints" element={<CheckpointData />} />
          <Route path="*" element={<Checkpoint />} />
        </Routes>
      </Router>
    </div>
  );
}
