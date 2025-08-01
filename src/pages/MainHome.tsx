import CardsMainHome from "../components/layout/CardsMainHome.tsx";
export default function MainHome(){
  return(
    //PAGINA PRINCIPAL CUANDO ESTA LOGGEADO
    <div className="container text-bg-dark">
      <main className="container d-flex flex-column gap-4">
        <h1 className="text-center">HOME</h1>
        <CardsMainHome url="torneos" title="Torneos" text="Explora y crea torneos en mas de xx deportes, juega solo o con amigos, en torneos con formato de liga o copa!" imgAlt="sports image" imgUrl="src\sports.avif"/>
        <CardsMainHome url="noticias" title="Noticias" text="Lee los ultimos y mas relevantes anuncios sobre los torneos que se han jugado o estan por jugarse!" imgAlt="news image" imgUrl="src\sports.avif"/>
      </main>
    </div>
  )
}