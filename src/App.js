import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { SocketProvider } from './providers/Socket'

function App() {
  return (
    <div className="App">
      <SocketProvider>
      <Routes>
          <Route path="/" element={<Home/>} />
      </Routes>
      </SocketProvider>
    </div>
  );
}

export default App;
