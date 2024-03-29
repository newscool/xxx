import { Link, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Logo from './logo';

export default function Layout() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const onLogOut = async () => {
    const ok = confirm('로그아웃을 하시겠어요?');
    if (ok) {
      await auth.signOut();
      navigate('/login');
    }
  };
  return (
    <div className="container flex h-full mx-auto gap-[100px] p-5 pb-10 sm:p-0">
      {/* header */}
      <header className="sm:basis-[30%] fixed sm:relative bottom-0 left-0 w-full border-t border-zinc-100">
        <div className="relative bottom-0 flex items-center justify-around w-full gap-5 p-2 bg-white sm:fixed sm:w-auto sm:h-full sm:flex-col sm:pt-7 sm:items-start sm:p-0">
          {/* logo */}
          <Logo size={80} />
          {[
            ['홈', '/'],
            ['프로필', '/profile'],
            ['로그아웃', '/logout'],
          ].map(([title, path]) => (
            <div key={path} className="left-menu">
              {title === '홈' ? (
                <Link to={path}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>

                  <span>{title}</span>
                </Link>
              ) : (
                ''
              )}
              {title === '프로필' ? (
                <Link to={path}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>

                  <span>{title}</span>
                </Link>
              ) : (
                ''
              )}
              {title === '로그아웃' ? (
                <div onClick={onLogOut}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 stroke-rose-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                    />
                  </svg>

                  <span className="text-rose-500">{title}</span>
                </div>
              ) : (
                ''
              )}
            </div>
          ))}
          <div className="items-center hidden gap-2 pb-10 mt-auto sm:flex">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
              {user?.photoURL ? <img src={user?.photoURL} className="block object-cover w-full h-full" /> : <div></div>}
            </div>
            <div>
              <div className="mb-1 font-semibold leading-none">{user?.displayName}</div>
              <div className="text-sm leading-none text-sky-900/40">{user?.email}</div>
            </div>
          </div>
        </div>
      </header>

      {/* outlet */}
      <Outlet />
    </div>
  );
}
