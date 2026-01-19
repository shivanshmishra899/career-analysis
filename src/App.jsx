import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// We are assuming your CareerAnalysisTool component exists and is correctly exported
// from './pages/CareerAnalysisPage.jsx'.
import CareerAnalysisTool from './pages/CareerAnalysisPage';

function HomePage() {
  return (
    // If these styles apply, Tailwind is working.
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
        Welcome to Diverse Loopers
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl">
        This is your homepage. If you see this text styled and centered,
        it means Tailwind CSS is finally working correctly.
      </p>
      <Link
        to="/career-analysis"
        className="mt-8 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105"
      >
        Go to Career Analysis
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            Diverse <span className="text-indigo-600">Loopers</span>
          </Link>
          <div className="flex gap-8 items-center font-semibold">
            <Link to="/" className="text-gray-600 hover:text-indigo-600">
              Home
            </Link>
            <Link to="/career-analysis" className="text-gray-600 hover:text-indigo-600">
              Career Analysis
            </Link>
          </div>
        </nav>
      </header>
      <main className="bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/career-analysis" element={<CareerAnalysisTool />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
