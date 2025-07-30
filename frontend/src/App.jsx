import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import StockPage from './components/StockDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchBar />} />
        <Route path="/stock/:symbol" element={<StockPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
