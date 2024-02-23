import PostWriteForm from '../components/post-write-form';
import Timeline from '../components/timeline';

export default function Home() {
  return (
    <main className="flex gap-[50px] basis-[80%]">
      <div className="w-[60%] py-8">
        <PostWriteForm />
        <Timeline />
      </div>
      <div className="w-[400px] bg-zinc-50 p-10">
        <div className="fixed h-full text-zinc-400">Right Aside</div>
      </div>
    </main>
  );
}
