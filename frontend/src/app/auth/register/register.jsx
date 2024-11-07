import CreateInputForm from '@components/CreateInputForm';
import { register } from './registerSlice';
import { useDispatch } from 'react-redux';

export default function Register() {
  const dispatch = useDispatch();

  return (
    <CreateInputForm
      formFields={[
        { name: 'firstName', value: '', required: true },
        { name: 'lastName', value: '', required: true },
        { name: 'username', value: '', required: true },
        { name: 'email', value: '', required: true },
        { name: 'password', value: '', required: true, type: 'password' },
      ]}
      onSubmit={({ firstName, lastName, username, email, password }) =>
        dispatch(register(firstName, lastName, username, email, password))
      }
    />
  );
}
