import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AuthCallback from './pages/AuthCallback'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import NewRequests from './pages/NewRequests'
import MyBids from './pages/MyBids'
import ActiveJobs from './pages/ActiveJobs'
import CompletedJobs from './pages/CompletedJobs'
import EarningsReport from './pages/EarningsReport'

function App() {
    return (
        <Router>
            <Routes>
                {/* Auth callback route - NOT protected */}
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* Protected routes */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="requests" element={<NewRequests />} />
                    <Route path="bids" element={<MyBids />} />
                    <Route path="active-jobs" element={<ActiveJobs />} />
                    <Route path="completed-jobs" element={<CompletedJobs />} />
                    <Route path="earnings" element={<EarningsReport />} />
                    {/* Placeholder routes */}
                    <Route path="drivers" element={<div className="text-2xl">Drivers Management - Coming Soon</div>} />
                    <Route path="vehicles" element={<div className="text-2xl">Vehicles Management - Coming Soon</div>} />
                    <Route path="settings" element={<div className="text-2xl">Settings - Coming Soon</div>} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
