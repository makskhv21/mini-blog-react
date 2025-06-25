import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <Router basename="/">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
