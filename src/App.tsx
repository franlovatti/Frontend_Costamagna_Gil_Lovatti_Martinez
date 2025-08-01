import MainLayout from './components/layout/MainLayout.tsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainHome from './pages/MainHome.tsx';
import Torneos from './pages/Torneos.tsx';
import Noticias from './pages/Noticias.tsx';
import Perfil from './pages/Perfil.tsx';


function App() {
  /*falta agregar logica de logeo esta route "/" tendria que ser en realidad protegia por loggin y ser " home"
  <Route path='/home' element={<ProtectedRoute allowedRoles={["User o Admin"]} />}>
          <Route index element={<LoggedHome />} />
            <Route path="torneos" element={<Torneos />} />
            <Route path="noticias" element={<Noticias />} />
            <Route path="perfil" element={<Perfil />} />
  </Route>

  y la de path "/ deberia ser"
  <Route path='/' element={<noLoggedLayout/>}>
          <Route index element={<NoLoggedHome />} />
  </Route>
  
  */
  return (
    <BrowserRouter>
      <div className="App">
      <Routes>
        <Route path='/' element={<MainLayout/>}>
          <Route index element={<MainHome />} />
          <Route path="torneos" element={<Torneos />} />
          <Route path="noticias" element={<Noticias />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
