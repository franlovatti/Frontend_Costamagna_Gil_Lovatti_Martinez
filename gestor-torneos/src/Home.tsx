import './styles/Home.css';

export default function Home(){
  return(
  <>
    <div className="home-container">
      <h1>Home</h1>
      <div className="home-card-container">
        <div className="home-card-text">
          <h2 className="home-card-title">Torneos</h2>
          <p className="home-card-p">Crea y descubre los mejores torneos para competir y divertirte en +x deportes! <br /> Inscribite solo o con amigos en torneos publicos o privados</p>
        </div>
        <img className="home-card-img" src="src\assets\herramientas-deportivas_53876-138077.avif" alt="" />
      </div>
   
      <div className="home-card-container">
        <div className="home-card-text">
          <h2 className="home-card-title">Tablon</h2>
          <p className="home-card-p">Lee las ultimas y mas relevantes noticias sobre los torneos jugados!<br /> No te pierdas de los anuncios y ..</p>
        </div>
        <img className="home-card-img" src="src\assets\old-newspaper-background-grungy-paper-texture-black-white-news-print-pattern-wallpaper-design-with-unreadable-text_1028938-386.avif" alt="" />
      </div>
    </div>
  </>
  )
  
}
