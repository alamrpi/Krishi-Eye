import AppRouter from './app/Router';
import ErrorBoundary from './shared/components/ErrorBoundary';
import { ToastProvider } from './shared/components/Toast';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
