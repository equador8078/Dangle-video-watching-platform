import {AuthProvider} from "./context/AuthContext"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import PlaylistSection from "./components/playlist/playList";
import HistorySection from "./components/historySection";
import Home from "./components/home";
import Upload from "./components/uploadVideo";
import ClickedVideo from "./components/clickedVideo";
import Login from "./components/login";
import SignUp from "./components/signup";
import YourVideo from "./components/yourVideo/YourVideo";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { PanelProvider } from "./context/PanelContext";

function App() {
  return (
    <AuthProvider>
      <PanelProvider>
      <SubscriptionProvider>
        <Router>
          <AppContent />
        </Router>
      </SubscriptionProvider>
      </PanelProvider>
    </AuthProvider>
  );
}

function AppContent() {

  return (
    <div className="flex">
      <Navbar />
      <div className="mt-18">
          <Routes>
            <Route path="/user/login" element={<Login />} />
            <Route path="/user/signup" element={<SignUp />} />
            <Route path="/" element={<Home />} />
            <Route path="/user/history"  element={<HistorySection />}/>
            <Route path="/videos/home" element={<Home />} />
            <Route path="/videos/upload" element={<Upload />} />
            <Route path="/videos/played/:videoId" element={<ClickedVideo />} />
            <Route path="/user/playList" element={<PlaylistSection />} />
            <Route path="/videos/yourVideo" element={<YourVideo/>} />
          </Routes>
        </div>
      </div>
  );
}

export default App;
