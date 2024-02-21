import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { useRef, useState } from 'react';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function PostWriteForm() {
  const refTextarea = useRef<HTMLTextAreaElement>(null);

  const [isLoading, setLoading] = useState(false);
  const [post, setPost] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (refTextarea.current) {
      refTextarea.current.style.height = 'auto';
      refTextarea.current.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || post === '' || post.length > 180) return;
    try {
      setLoading(true);
      const doc = await addDoc(collection(db, 'posts'), {
        post,
        createdAt: Date.now(),
        username: user.displayName || 'Anonymous',
        userId: user.uid,
      });

      if (file) {
        const locationRef = ref(storage, `posts/${user.uid}-${user.displayName}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }
      setPost('');
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col flex-1 w-full h-auto p-6 rounded-lg bg-zinc-50 has-[:focus]:bg-zinc-100 transition-all"
    >
      <textarea
        ref={refTextarea}
        onInput={handleInput}
        onChange={onChange}
        maxLength={180}
        className="min-h-[60px] text-xl font-medium bg-transparent border-0 outline-none resize-none"
        placeholder="당신 앞에 어떤 햄버거가 놓여있나요?"
        required
      ></textarea>
      <div className="flex items-center justify-between">
        <label
          htmlFor="file"
          className="flex items-center gap-1 px-6 bg-gray-500 cursor-pointer hover:bg-gray-600 button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            {file ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            )}
          </svg>
          <span>{file ? '햄버거 추가됨' : '햄버거 사진 추가하기'}</span>
        </label>
        <input onChange={onFileChange} type="file" id="file" accept="image/*" className="hidden" />
        <button type="submit" className="flex items-center gap-1 px-6 bg-green-500 button hover:bg-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 fill-white" viewBox="0 0 32 32">
            <path d="M 11 5 C 7.699219 5 5 7.699219 5 11 L 5 11.25 L 3.875 12.75 C 4.230469 13.015625 4.601563 13.191406 5 13.3125 L 5 15.78125 C 4.390625 16.332031 4 17.121094 4 18 C 4 18.878906 4.390625 19.667969 5 20.21875 L 5 23 C 5 24.09375 5.90625 25 7 25 L 25 25 C 26.09375 25 27 24.09375 27 23 L 27 20.21875 C 27.609375 19.667969 28 18.878906 28 18 C 28 17.121094 27.609375 16.332031 27 15.78125 L 27 13.3125 C 27.398438 13.191406 27.769531 13.015625 28.125 12.75 L 27 11.21875 L 27 11 C 27 7.699219 24.300781 5 21 5 Z M 11 7 L 12 7 C 12 7.550781 12.449219 8 13 8 C 13.550781 8 14 7.550781 14 7 L 21 7 C 23.21875 7 25 8.78125 25 11 L 25 11.5 C 24.742188 11.429688 24.503906 11.292969 24.28125 11.125 L 23.75 10.75 L 23.15625 11.09375 L 22.40625 11.53125 C 21.707031 11.949219 20.855469 11.949219 20.15625 11.53125 L 19.40625 11.09375 L 18.9375 10.8125 L 18.4375 11.03125 L 17 11.78125 C 16.378906 12.089844 15.652344 12.089844 15.03125 11.78125 L 13.5625 11.03125 L 13.0625 10.8125 L 12.59375 11.09375 L 11.84375 11.53125 C 11.144531 11.949219 10.292969 11.949219 9.59375 11.53125 L 8.84375 11.09375 L 8.25 10.75 L 7.71875 11.125 C 7.496094 11.292969 7.253906 11.429688 7 11.5 L 7 11 C 7 8.78125 8.78125 7 11 7 Z M 11 8 C 10.449219 8 10 8.449219 10 9 C 10 9.550781 10.449219 10 11 10 C 11.550781 10 12 9.550781 12 9 C 12 8.449219 11.550781 8 11 8 Z M 15 8 C 14.449219 8 14 8.449219 14 9 C 14 9.550781 14.449219 10 15 10 C 15.550781 10 16 9.550781 16 9 C 16 8.449219 15.550781 8 15 8 Z M 8.15625 13 L 8.5625 13.25 C 9.890625 14.046875 11.546875 14.046875 12.875 13.25 L 13.15625 13.0625 L 14.125 13.5625 C 15.304688 14.152344 16.695313 14.152344 17.875 13.5625 L 18.84375 13.0625 L 19.125 13.25 C 20.453125 14.046875 22.109375 14.046875 23.4375 13.25 L 23.84375 13 C 24.21875 13.179688 24.601563 13.292969 25 13.375 L 25 15 L 7 15 L 7 13.375 C 7.398438 13.292969 7.78125 13.179688 8.15625 13 Z M 7 17 L 25 17 C 25.566406 17 26 17.433594 26 18 C 26 18.566406 25.566406 19 25 19 L 7 19 C 6.433594 19 6 18.566406 6 18 C 6 17.433594 6.433594 17 7 17 Z M 7 21 L 25 21 L 25 23 L 7 23 Z"></path>
          </svg>

          <span>{isLoading ? '햄버거 올라가는 중...' : '햄버거 자랑하기'}</span>
        </button>
      </div>
    </form>
  );
}
