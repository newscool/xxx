import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { IPost } from '../components/timeline';
import Post from '../components/post';

export default function Profile() {
  const user = auth.currentUser;
  const [nameEditMode, setNameEditMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [posts, setPosts] = useState<IPost[]>([]);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (user && files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, { photoURL: avatarUrl });

      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        await updateDoc(doc(db, 'users', user.uid), {
          photoUrl: user.photoURL,
        });
      }
    }
  };
  const enableEditMode = () => {
    setNameEditMode(true);
  };
  const disableEditMode = () => {
    setNameEditMode(false);
    editName();
  };
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };
  const editName = async () => {
    if (user) {
      try {
        await updateProfile(user, { displayName: newName });
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { name: newName });
        alert('이름이 변경되었습니다.');
        window.location.reload();
      } catch (e) {
        console.log(e);
      }
    }
  };
  const fetchPosts = async () => {
    const postQuery = query(
      collection(db, 'posts'),
      where('userId', '==', user?.uid),
      orderBy('createdAt', 'desc'),
      limit(25)
    );
    const snapshot = await getDocs(postQuery);
    const posts = snapshot.docs.map((doc) => {
      const { post, createdAt, userId, username, photo } = doc.data();
      return {
        post,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setPosts(posts);
  };
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col items-center justify-start w-full py-10 max-w-[700px] mx-auto">
      <label
        htmlFor="avatar"
        className="cursor-pointer rounded-full w-[120px] h-[120px] overflow-hidden bg-zinc-50 flex justify-center "
      >
        {avatar ? (
          <img src={avatar} className="block object-cover w-full aspect-square" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-[60px] fill-zinc-300"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </label>
      <input onChange={onAvatarChange} id="avatar" type="file" accept="image/*" className="hidden" />

      {!nameEditMode ? (
        <div className="flex items-center gap-3 mt-5">
          <div className="text-2xl h-[40px] flex items-center">{user?.displayName ?? '이름없음'}</div>
          <button
            onClick={enableEditMode}
            className="flex items-center justify-center h-full gap-1 px-5 text-white rounded-full bg-zinc-700 hover:bg-zinc-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4">
              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
            </svg>
            <span>수정</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-5">
          <input
            onChange={onChangeName}
            placeholder={user?.displayName != null ? user?.displayName : ''}
            type="text"
            className="p-2 border bg-zinc-50"
          />
          <button
            onClick={disableEditMode}
            className="flex items-center justify-center h-full gap-1 px-5 text-white rounded-full bg-zinc-700 hover:bg-zinc-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4">
              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
            </svg>
            <span>저장</span>
          </button>
        </div>
      )}

      {/* post */}
      <div className="w-full mt-20">
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
