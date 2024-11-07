import CreateInputForm from '@components/CreateInputForm';
import { login } from './loginSlice';
import { useDispatch } from 'react-redux';

export default function Login() {
  const dispatch = useDispatch();
  // need to add on login submit
  return (
    <CreateInputForm
      formFields={[
        { name: 'email', value: '', required: true },
        { name: 'password', value: '', required: true, type: 'password' },
      ]}
      onSubmit={({ email, password }) => dispatch(login(email, password))}
    />
  );
}
