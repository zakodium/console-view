import { ViewProvider } from './ViewContext';
import ViewHeader from './ViewHeader';
import ViewMain from './ViewMain';

export default function View() {
  return (
    <ViewProvider>
      <div>
        <ViewHeader />
        <ViewMain />
      </div>
    </ViewProvider>
  );
}
