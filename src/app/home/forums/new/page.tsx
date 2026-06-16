import { ForumSubHeader } from "@/components/ForumSubHeader";
import { requireUser } from "@/lib/auth";
import { CreateForumForm } from "./CreateForumForm";

export const dynamic = "force-dynamic";

export default async function NewForumPage() {
  await requireUser();
  return (
    <div className="forum-page min-h-full">
      <ForumSubHeader backHref="/home/forums" title="Vytvoriť fórum" />
      <CreateForumForm />
    </div>
  );
}
