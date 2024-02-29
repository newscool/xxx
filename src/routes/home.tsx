import PostWriteForm from '../components/post-write-form';
import Timeline from '../components/timeline';

export default function Home() {
  return (
    <main className="flex gap-[50px] w-full">
      <div className="w-full py-8">
        <PostWriteForm />
        <Timeline />
      </div>
    </main>
  );
}
