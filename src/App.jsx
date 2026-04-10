import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import FlashcardsPage from "./pages/FlashcardsPage";
import StudySetsPage from "./pages/StudySetsPage";
import QuizPage from "./pages/QuizPage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flashcards" element={<StudySetsPage />} />
        <Route path="/flashcards/:setId" element={<FlashcardsPage />} />
        <Route path="/quiz/:setId" element={<QuizPage />} />
      </Routes>
    </>
  );
}