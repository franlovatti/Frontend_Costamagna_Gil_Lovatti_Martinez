import FormPartido from '../components/FormPartido.tsx';
import { useParams } from 'react-router';

export default function EditarPartido() {
  const { id, partidoId} = useParams<{ id: string, partidoId: string}>();
  return(
    <FormPartido
    id = {id!}
    createMode = {false}
    partidoId = {partidoId}
    />
  );
}