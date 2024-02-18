import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Home() {
  const logOut = () => {
    signOut(auth);
  };
  return (
    <>
      <h1>Home</h1>
      <button onClick={logOut} className="px-4 py-1 rounded-full ring-1 ring-zinc-500">
        Logout
      </button>
    </>
  );
}
