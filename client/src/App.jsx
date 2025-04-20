import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FlashcardPage from "./pages/FlashcardPage";
import QuizPage from "./pages/QuizPage";
import QuizFillBlankPage from "./pages/FillBlankQuizPage";
import TranslateQuizPage from "./pages/TranslateQuizPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flashcards" element={<FlashcardPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/fill-blank" element={<QuizFillBlankPage />} />
        <Route path="/quiz/translate" element={<TranslateQuizPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
