import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import Post from './post';
import { Unsubscribe } from 'firebase/auth';

export interface IPost {
  id: string;
  photo: string;
  post: string;
  userId: string;
  username: string;
  createdAt: number;
}

export default function Timeline() {
  const [posts, setPost] = useState<IPost[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchPosts = async () => {
      const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(30));

      unsubscribe = await onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map((doc) => {
          const { photo, post, userId, username, createdAt } = doc.data();
          return {
            id: doc.id,
            photo,
            post,
            userId,
            username,
            createdAt,
          };
        });
        setPost(posts);
      });
    };
    fetchPosts();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col mt-10">
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
}
