import { Route, Routes } from 'react-router';
import { NavMenu } from './lib/navMenu';
import { AppLayout } from './pages/AppLayout';
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
        </Route>
          <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
