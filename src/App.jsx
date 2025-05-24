import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Categories from './components/Categories/Categories';
import Products from './components/Products/Products';
import Features from './components/Features/Features';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Categories />
      <Products />
      <Features />
    </div>
  );
}

export default App;
