import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import ThreeInputsPage from './components/seller';
import BuyerDetailsPage from './components/buyer';
import MainPage from './components/main';

function App() {
  return (
    <div>
      <Routes> {/* Wrap your routes with <Routes> */}
        <Route path="/" element={<MainPage />} />
        <Route path="/seller" element={<ThreeInputsPage />} />
        <Route path="/buyer/:sellerDetails" element={<BuyerDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;
