import { Link } from "react-router-dom";
type props={
  url:string,
  title:string,
  text:string,
  imgUrl:string
  imgAlt:string
}

export default function CardsMainHome({url,title,text,imgUrl,imgAlt}:props){
  return(
    <Link to={`/${url}`} className="link-underline link-underline-opacity-0 link-light link-offset-2 link-opacity-75-hover">
      <div className="row justify-content-center border border-2 border-top-0 border-end-0 border-bottom-0 border-primary ">
        <div className="col-lg-9 col-sm-12 p-2">
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
        <div className="col-lg-3 d-sm-none d-lg-block p-0">
          <img src={imgUrl} className="rounded img-fluid" alt={imgAlt} />
        </div>
      </div>
    </Link>
  )
}