import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Minimum from "./pages/Minimum";
import Maximum from "./pages/Maximum";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Minimum />} />
          <Route path="/max" element={<Maximum />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
