-- Performance indexes for feed, calendar, forum, and follow queries
CREATE INDEX "Post_published_publishedAt_idx" ON "Post"("published", "publishedAt" DESC);
CREATE INDEX "Post_type_published_publishedAt_idx" ON "Post"("type", "published", "publishedAt" DESC);
CREATE INDEX "Post_profileId_published_publishedAt_idx" ON "Post"("profileId", "published", "publishedAt" DESC);
CREATE INDEX "ClubProfile_published_sortOrder_idx" ON "ClubProfile"("published", "sortOrder");
CREATE INDEX "ProfileFollow_profileId_idx" ON "ProfileFollow"("profileId");
CREATE INDEX "Event_published_startsAt_idx" ON "Event"("published", "startsAt");
CREATE INDEX "ForumThread_forumId_status_createdAt_idx" ON "ForumThread"("forumId", "status", "createdAt" DESC);
CREATE INDEX "ForumComment_threadId_status_createdAt_idx" ON "ForumComment"("threadId", "status", "createdAt");
