import { PostForm } from "../PostForm";

export default function NewPostPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">Nový obsah</h1>
      <p className="mt-1 text-sm text-brand-purple/70">
        Pridajte video, článok alebo recept pre členov.
      </p>
      <PostForm mode="create" />
    </div>
  );
}
