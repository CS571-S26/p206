import React from "react";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div>
      <Navbar />
      <h1>My Web Project</h1>
    </div>
  );
}
