-- Track who uploaded a media asset (for access control on /api/media/[id]).
ALTER TABLE "MediaAsset" ADD COLUMN "uploadedById" TEXT;

ALTER TABLE "MediaAsset"
  ADD CONSTRAINT "MediaAsset_uploadedById_fkey"
  FOREIGN KEY ("uploadedById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "MediaAsset_uploadedById_idx" ON "MediaAsset"("uploadedById");
