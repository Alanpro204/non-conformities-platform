-- DropForeignKey
ALTER TABLE "nonconformity" DROP CONSTRAINT "nonconformity_sprintId_fkey";

-- DropForeignKey
ALTER TABLE "sprint" DROP CONSTRAINT "sprint_projectId_fkey";

-- AddForeignKey
ALTER TABLE "sprint" ADD CONSTRAINT "sprint_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nonconformity" ADD CONSTRAINT "nonconformity_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
