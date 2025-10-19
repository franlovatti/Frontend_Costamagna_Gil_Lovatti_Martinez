import FormPartido from '../components/FormPartido.tsx';
import { useParams } from 'react-router';
export default function CrearPartido() {
  const { id } = useParams<{ id: string }>();
  return(FormPartido({id: id?? '0', createMode: true}));
}
