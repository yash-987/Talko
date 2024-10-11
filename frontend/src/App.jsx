import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import "./App.css"
export default function App() {
  return (
    
      <div className="App">
        <Routes>
          <Route path="/" Component={HomePage} />
          
          <Route path="/chats" Component={ChatPage } />
        </Routes>
    </div>
    
  )
}