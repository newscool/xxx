import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import { IPost } from './timeline';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';

export default function Post({ photo, post, username, createdAt, userId, id }: IPost) {
  const user = auth.currentUser;

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
  return (
    <div className="py-10 border-t">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-lg">{username}</div>
        {/* <div>{createdAt}</div> */}
      </div>
      <div>
        <img src={photo} className="rounded-xl" />
        {editMode ? (
          <div className="mb-5">
            <textarea
              onChange={onChange}
              className="w-full p-5 my-3 text-xl resize-none rounded-xl text-zinc-600 bg-zinc-50 h-[150px]"
            >
              {postContent}
            </textarea>
            <button onClick={submit} className="w-full button">
              수정완료
            </button>
          </div>
        ) : (
          <div className="mt-3 text-xl">{post}</div>
        )}
      </div>
      {user?.uid === userId ? (
        <div className="flex gap-1">
          <button onClick={onDelete} className="px-3 py-1 mt-2 text-sm text-white rounded-full bg-rose-600">
            삭제
          </button>
          <button onClick={onEdit} className="px-3 py-1 mt-2 text-sm text-white rounded-full bg-zinc-400">
            수정
          </button>
        </div>
      ) : null}
    </div>
  );
}
