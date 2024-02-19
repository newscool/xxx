import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/logo';
import { FirebaseError } from 'firebase/app';
import GithubButton from '../components/github-button';
import GoogleButton from '../components/google-button';

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
      <h1 className="flex flex-col items-center justify-center mb-7">
        <Logo size={90} />
        <p className="text-xl font-medium">계정을 만드세요.</p>
      </h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 text-sm">
        {[
          ['text', 'name', '이름'],
          ['email', 'email', '이메일'],
          ['password', 'password', '비밀번호'],
        ].map(([type, name, placeholder]) => (
          <input onChange={onChange} type={type} name={name} placeholder={placeholder} required className="input" />
        ))}
        <input type="submit" value={isLoading ? '로딩중...' : '가입하기'} className="button" />
      </form>
      {error !== '' ? <div className="mt-3 text-xs text-rose-500">{error}</div> : null}
      <div className="flex justify-center gap-3 mt-10 text-base">
        <p className="text-zinc-400">이미 계정이 있으신가요?</p>
        <Link to="/login" className="font-medium text-green-500 hover:text-green-600">
          로그인 하기
          <i className="ml-1 las la-arrow-right"></i>
        </Link>
      </div>
      <div className="flex flex-col gap-3 mt-10">
        <GithubButton />
        <GoogleButton />
      </div>
    </div>
  );
}
