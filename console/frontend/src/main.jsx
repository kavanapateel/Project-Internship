import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Login from './Login.jsx';
import Register from './Register.jsx';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './styles.css';
import Home from './Home.jsx';
import Page1 from './Page1.jsx';
import Location from './Location.jsx';
import Reader from './Reader.jsx';
import Port from './Port.jsx';
import Tag from './Tag.jsx';
import Trolley from './Trolley.jsx';
import Line from './Line.jsx';
import Page2 from './Page2.jsx';
import CheckpointData from './components/CheckpointData.jsx';
import ReaderList from './ReaderList.jsx';
import ReportPage from './ReportPage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/page1" element={<Page1 />} />
        <Route path="/location" element={<Location />} />
        <Route path="/reader" element={<Reader />} />
        <Route path="/port" element={<Port />} />
        <Route path="/tag" element={<Tag />} />
        <Route path="/trolley" element={<Trolley />} />
        <Route path="/line" element={<Line />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<CheckpointData />} />
        <Route path="/readerlist" element={<ReaderList />} />
        <Route path="/reportpage" element={<ReportPage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
