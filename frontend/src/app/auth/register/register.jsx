import CreateInputForm from '@components/CreateInputForm';
import { register } from './registerSlice';
import { useDispatch } from 'react-redux';

export default function Register() {
  const dispatch = useDispatch();

  return (
    <CreateInputForm
      formFields={[
        // { name: 'firstName', value: '', required: false },
        // { name: 'lastName', value: '', required: false },
        { name: 'username', value: '', required: true },
        { name: 'email', value: '', required: true },
        { name: 'password', value: '', required: true, type: 'password' },
      ]}
      onSubmit={({ username, email, password }) => dispatch(register(username, email, password))}
    />
  );
}
