
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/ui/Layout';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Dashboard } from './pages/Dashboard';
import { CheckIn } from './pages/CheckIn';
import { Members } from './pages/Members';
import { Plans } from './pages/Plans';
import { Payments } from './pages/Payments';
import { Receipts } from './pages/Receipts';
import { PaymentHistory } from './pages/PaymentHistory';
import { ExtraPayments } from './pages/ExtraPayments';
import { Login } from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="check-in" element={<CheckIn />} />
            <Route path="members" element={<Members />} />
            <Route path="plans" element={<Plans />} />
            <Route path="payments" element={<Payments />} />
            <Route path="extra-payments" element={<ExtraPayments />} />
            <Route path="receipts" element={<Receipts />} />
            <Route path="payment-history" element={<PaymentHistory />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
