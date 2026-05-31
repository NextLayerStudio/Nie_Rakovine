import { ForumAdminForm } from "../ForumAdminForm";

export default function NewForumPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Nové fórum</h1>
      <p className="mt-1 text-sm text-brand-purple/70">
        Vytvorte novú tému, do ktorej sa môžu používatelia zapojiť.
      </p>
      <ForumAdminForm mode="create" />
    </div>
  );
}
