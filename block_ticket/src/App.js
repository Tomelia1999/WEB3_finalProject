import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import ThreeInputsPage from './main';
import BuyerDetailsPage from './buyer';

function App() {
  return (
    <div>
      <Routes> {/* Wrap your routes with <Routes> */}
        <Route path="/" element={<ThreeInputsPage />} />
        <Route path="/buyer/:sellerDetails" element={<BuyerDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;
