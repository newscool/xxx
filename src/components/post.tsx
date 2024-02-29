import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import { IPost } from './timeline';
import { deleteObject, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/dist/locale/ko';

export interface IAuthor {
  uid: string;
  name: string;
  email: string;
  photoUrl: string;
}

export default function Post({ photo, post, userId, id, createdAt }: IPost) {
  const user = auth.currentUser;

  const createdDate = moment(createdAt).fromNow();

  const [author, setAuthor] = useState<IAuthor>();
  const [editMode, setEditMode] = useState(false);
  const [postContent, setPostContent] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  const onDelete = async () => {
    const ok = confirm('게시글을 삭제할까요?');
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, 'posts', id));
      if (photo) {
        const photoRef = ref(storage, `posts/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('finally');
    }
  };
  const onEdit = async () => {
    setEditMode(true);
    setPostContent(post);
  };

  const submit = async () => {
    try {
      const postRef = doc(db, 'posts', id);
      console.log(postRef);
      await updateDoc(postRef, {
        post: postContent,
      });
      setEditMode(false);
    } catch (e) {
      console.log(e);
    }
  };

  const getAuthorInfo = async () => {
    try {
      const author = await getDoc(doc(db, 'users', userId));
      if (author.exists()) {
        const { uid, email, photoUrl, name } = author.data();
        setAuthor({
          uid,
          name,
          email,
          photoUrl,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAuthorInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="py-10 border-t">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 overflow-hidden rounded-full bg-zinc-50">
          <img src={author?.photoUrl} className="block object-cover w-full h-full" />
        </div>
        <div className="font-semibold ">{author?.name}</div>
        <div className=" text-zinc-400">{author?.email}</div>
        <div className="text-blue-400 ">{createdDate}</div>
      </div>
      <div>
        <img src={photo} className="w-full rounded-xl" />
        {editMode ? (
          <div className="mb-5">
            <textarea
              value={postContent}
              onChange={onChange}
              className="w-full p-5 my-3 text-xl resize-none rounded-xl text-zinc-600 bg-zinc-50 h-[150px]"
            ></textarea>
            <button onClick={submit} className="w-full button">
              수정완료
            </button>
          </div>
        ) : (
          <div className="mt-4 text-xl">{post}</div>
        )}
      </div>
      {user?.uid === userId ? (
        <div className="flex gap-2 mt-3">
          <button onClick={onDelete} className="px-3 py-1 mt-2 text-sm text-white rounded-md bg-rose-600">
            삭제
          </button>
          <button onClick={onEdit} className="px-3 py-1 mt-2 text-sm text-white rounded-md bg-zinc-400">
            수정
          </button>
        </div>
      ) : null}
    </div>
  );
}
