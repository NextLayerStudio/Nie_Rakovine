import { ForumSubHeader } from "@/components/ForumSubHeader";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { NewThreadForm } from "./NewThreadForm";

export const dynamic = "force-dynamic";

export default async function NewThreadPage({
  params,
}: {
  params: Promise<{ forumId: string }>;
}) {
  const { forumId } = await params;
  const user = await requireUser();

  const forum = await prisma.forum.findUnique({
    where: { id: forumId },
    include: { members: { where: { userId: user.id } } },
  });
  if (!forum || !forum.published || forum.members.length === 0) notFound();

  return (
    <>
      <ForumSubHeader backHref={`/home/forums/${forumId}`} title="Nový príspevok" />
      <NewThreadForm forumId={forumId} />
    </>
  );
}
