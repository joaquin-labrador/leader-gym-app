
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/ui/Layout';

// Pages
import { Dashboard } from './pages/Dashboard';
import { CheckIn } from './pages/CheckIn';
import { Members } from './pages/Members';
import { Plans } from './pages/Plans';
import { Payments } from './pages/Payments';
import { Receipts } from './pages/Receipts';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="check-in" element={<CheckIn />} />
          <Route path="members" element={<Members />} />
          <Route path="plans" element={<Plans />} />
          <Route path="payments" element={<Payments />} />
          <Route path="receipts" element={<Receipts />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
