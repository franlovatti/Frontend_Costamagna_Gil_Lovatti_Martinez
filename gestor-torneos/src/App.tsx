import './App.css';
import Layout from './components/layout/layout.tsx';
import Home from './home.tsx';


function App() {
  return (
    <div>
      <Layout>
        <Home />
      </Layout>
    </div>
  );
}

export default App;
