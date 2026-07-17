-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_materialId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_materialId_fkey";

-- DropIndex
DROP INDEX "Assignment_materialId_key";

-- DropIndex
DROP INDEX "Quiz_materialId_key";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "materialId",
ADD COLUMN     "courseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AssignmentSubmission" ADD COLUMN     "courseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "materialId",
ADD COLUMN     "courseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "QuizAttempt" DROP COLUMN "answers",
ADD COLUMN     "courseId" TEXT NOT NULL,
ADD COLUMN     "totalMarks" DECIMAL(5,2) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_courseId_key" ON "Assignment"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentSubmission_studentId_assignmentId_key" ON "AssignmentSubmission"("studentId", "assignmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_courseId_key" ON "Quiz"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizAttempt_studentId_quizId_key" ON "QuizAttempt"("studentId", "quizId");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

