-- CreateEnum
CREATE TYPE "CancerType" AS ENUM ('PRSNIK', 'HRUBE_CREVO', 'PLUCA', 'PROSTATA', 'KOZA', 'KRCOK_MATERNICE', 'TELO_MATERNICE', 'VAJECNIKY', 'MOCOVE_CESTY', 'PODZALUDKOVA', 'ZALUDOK', 'PECEN', 'LYMFOM', 'LEUKEMIA', 'MOZOG', 'STITNA_ZLAZA', 'HLAVA_KRK', 'INE');

-- AlterTable
ALTER TABLE "ClubProfile" ADD COLUMN     "cancerTypes" "CancerType"[] DEFAULT ARRAY[]::"CancerType"[];

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "cancerTypes" "CancerType"[] DEFAULT ARRAY[]::"CancerType"[];

-- AlterTable
ALTER TABLE "Forum" ADD COLUMN     "cancerTypes" "CancerType"[] DEFAULT ARRAY[]::"CancerType"[];

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "cancerTypes" "CancerType"[] DEFAULT ARRAY[]::"CancerType"[];

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "cancerTypes" "CancerType"[] DEFAULT ARRAY[]::"CancerType"[];
