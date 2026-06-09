import { notFound } from "next/navigation";
import { ForumSubHeader } from "@/components/ForumSubHeader";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { NewThreadForm } from "./NewThreadForm";

export const dynamic = "force-dynamic";

export default async function NewForumThreadPage({
  params,
}: {
  params: Promise<{ forumId: string }>;
}) {
  const { forumId } = await params;
  const user = await requireUser();

  const forum = await prisma.forum.findUnique({
    where: { id: forumId },
    include: {
      members: { where: { userId: user.id } },
    },
  });

  if (!forum || !forum.published) notFound();
  if (forum.members.length === 0) notFound();

  return (
    <>
      <ForumSubHeader backHref={`/home/forums/${forumId}`} title="Nový príspevok" />
      <NewThreadForm forumId={forumId} />
    </>
  );
}
