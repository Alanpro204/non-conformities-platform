-- DropForeignKey
ALTER TABLE "nonconformity" DROP CONSTRAINT "nonconformity_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "nonconformity" DROP CONSTRAINT "nonconformity_createdById_fkey";

-- AlterTable
ALTER TABLE "nonconformity" ALTER COLUMN "createdById" DROP NOT NULL,
ALTER COLUMN "assignedToId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "nonconformity" ADD CONSTRAINT "nonconformity_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nonconformity" ADD CONSTRAINT "nonconformity_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
