import { AppProvider } from '@/app/providers';
import { AppRouter } from '@/app/routes';

export const App = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};

export default App;
