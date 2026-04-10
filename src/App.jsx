import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import StudySetsPage from "./pages/StudySetsPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import QuizSetsPage from "./pages/QuizSetsPage";
import QuizPage from "./pages/QuizPage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/flashcards/:setId" element={<FlashcardsPage />} />
        <Route path="/quiz" element={<QuizSetsPage />} />
        <Route path="/quiz/:setId" element={<QuizPage />} />
      </Routes>
    </>
  );
}