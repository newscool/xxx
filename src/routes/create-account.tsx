import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/logo';
import { FirebaseError } from 'firebase/app';

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === 'name') setName(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading || name === '' || email === '' || password === '') return;
    try {
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      console.log(credentials.user);
      await updateProfile(credentials.user, { displayName: name });
      navigate('/');
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.code, e.message);
        setError(e.message);
      }
    } finally {
      setLoading(false);
      // console.log(name, email, password);
    }
  };

  return (
    <div className="container max-w-lg px-6">
      <h1 className="flex justify-center mb-5">
        <Logo size={80} />
      </h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 text-sm">
        {[
          ['text', 'name', 'Name'],
          ['email', 'email', 'Email'],
          ['password', 'password', 'Password'],
        ].map(([type, name, placeholder]) => (
          <input
            onChange={onChange}
            type={type}
            name={name}
            placeholder={placeholder}
            required
            className="px-4 py-2 border rounded-full"
          />
        ))}
        <input
          type="submit"
          value={isLoading ? 'Loading...' : 'Create Account'}
          className="p-3 mt-3 text-white rounded-full cursor-pointer bg-zinc-800 hover:bg-zinc-900"
        />
      </form>
      {error !== '' ? <div className="mt-3 text-xs text-rose-500">{error}</div> : null}
      <div className="flex justify-center gap-3 mt-5 text-sm">
        <p className="text-zinc-400">이미 계정이 있으신가요?</p>
        <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-600">
          로그인하기
          <i className="ml-1 las la-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
}
