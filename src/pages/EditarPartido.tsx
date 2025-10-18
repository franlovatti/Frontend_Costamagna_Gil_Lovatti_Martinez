import FormPartido from '../components/FormPartido.tsx';
import { useParams } from 'react-router';

export default function EditarPartido() {
  const { eventoId, partidoId} = useParams<{ eventoId: string, partidoId: string}>();
  return(
    <FormPartido
    id = {eventoId!}
    createMode = {false}
    partidoId = {partidoId}
    />
  );
}