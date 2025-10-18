import FormPartido from '../components/FormPartido.tsx';
import { useParams } from 'react-router';
export default function CrearPartido() {
  const { eventoId } = useParams<{ eventoId: string }>();
  return(FormPartido({id: eventoId?? '0', createMode: true}));
}
