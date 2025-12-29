import { Route, Routes } from 'react-router';
import { AppLayout } from './components/AppLayout';
import { NavMenu } from './lib/navMenu';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          {NavMenu.map((item) =>
            item.isIndex ? (
              <Route key={item.title} index element={item.element} />
            ) : (
              <Route key={item.title} path={item.href} element={item.element} />
            )
          )}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
