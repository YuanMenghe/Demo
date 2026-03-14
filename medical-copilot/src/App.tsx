import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HCPInsights from '@/pages/HCPInsights';
import RecommendationExpand from '@/pages/RecommendationExpand';
import ContentStudio from '@/pages/ContentStudio';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HCPInsights />} />
        <Route path="/recommendation" element={<RecommendationExpand />} />
        <Route path="/studio" element={<ContentStudio />} />
      </Routes>
    </BrowserRouter>
  );
}
