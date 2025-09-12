import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CareerAnalysisTool from './pages/CareerAnalysisPage'; 
// We will create this component in the next step.
// For now, it's just a placeholder.
// function CareerAnalysisPage() {
//   return (
//     <div className="p-10">
//       <h1 className="text-3xl font-bold">Career Analysis Tool Page</h1>
//       <p>The full tool will go here.</p>
//     </div>
//   );
// }

// A simple component for your homepage
function HomePage() {
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold">Welcome to Diverse Loopers</h1>
      <p className="mt-4">
        Navigate to the Career Analysis page to try our new tool!
      </p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <header className="bg-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            Diverse <span className="text-indigo-600">Loopers</span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium">
              Home
            </Link>
            <Link to="/career-analysis" className="text-gray-600 hover:text-indigo-600 font-medium">
              Career Analysis
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* The Routes component decides which page component to show based on the URL */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/career-analysis" element={<CareerAnalysisTool />} /> {/* <-- FIX IS HERE */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;