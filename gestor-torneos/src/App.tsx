import './App.css';
import Layout from './components/layout/layout.tsx';

function App() {
  return (
    <div>
      <Layout>
        {' '}
        <div className="container">
          <div>
            <h1>Gestor de Torneos</h1>
            <p>
              Bienvenido al gestor de torneos. Aquí podrás administrar tus
              torneos fácilmente.
            </p>
          </div>
          <div>
            <h1>nuevas cosas pronto...</h1>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default App;
