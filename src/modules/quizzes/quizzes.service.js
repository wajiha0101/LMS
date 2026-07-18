const { prisma } = require("../../lib/prisma");
const { AppError } = require("../../utils/AppError");

function sanitizeQuestionForInstructor(question) {
  return {
    id: question.id,
    questionText: question.questionText,
    options: question.options,
    correctAnswer: question.correctAnswer,
    position: question.position,
  };
}

function sanitizeQuestionForStudent(question) {
  return {
    id: question.id,
    questionText: question.questionText,
    options: question.options,
    position: question.position,
  };
}

function sanitizeQuiz(quiz, includeAnswers) {
  const sanitizeQuestion = includeAnswers ? sanitizeQuestionForInstructor : sanitizeQuestionForStudent;

  return {
    id: quiz.id,
    courseId: quiz.courseId,
    title: quiz.title,
    questions: quiz.questions ? quiz.questions.map(sanitizeQuestion) : undefined,
  };
}

function sanitizeAttempt(attempt) {
  return {
    id: attempt.id,
    quizId: attempt.quizId,
    courseId: attempt.courseId,
    studentId: attempt.studentId,
    score: attempt.score,
    totalMarks: attempt.totalMarks,
    submittedAt: attempt.submittedAt,
  };
}

async function getOwnedCourseOrFail(courseId, instructorId) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    throw AppError.NotFound("Course not found");
  }

  if (course.instructorId !== instructorId) {
    throw AppError.Forbidden("You do not own this course");
  }

  return course;
}

async function createQuiz(courseId, instructorId, input) {
  await getOwnedCourseOrFail(courseId, instructorId);

  const existingQuiz = await prisma.quiz.findUnique({ where: { courseId: courseId } });

  if (existingQuiz) {
    throw AppError.Conflict("This course already has a quiz");
  }

  const createdQuiz = await prisma.quiz.create({
    data: {
      courseId: courseId,
      title: input.title,
      questions: {
        create: input.questions.map((question) => ({
          questionText: question.questionText,
          options: question.options,
          correctAnswer: question.correctAnswer,
          position: question.position,
        })),
      },
    },
    include: { questions: { orderBy: { position: "asc" } } },
  });

  return sanitizeQuiz(createdQuiz, true);
}

async function updateQuiz(quizId, instructorId, input) {
  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });

  if (!quiz) {
    throw AppError.NotFound("Quiz not found");
  }

  await getOwnedCourseOrFail(quiz.courseId, instructorId);

  const updatedQuiz = await prisma.quiz.update({
    where: { id: quizId },
    data: input,
    include: { questions: { orderBy: { position: "asc" } } },
  });

  return sanitizeQuiz(updatedQuiz, true);
}

async function getQuizById(quizId, requestingUser) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { course: true, questions: { orderBy: { position: "asc" } } },
  });

  if (!quiz) {
    throw AppError.NotFound("Quiz not found");
  }

  const isOwningInstructor = quiz.course.instructorId === requestingUser.id;

  if (isOwningInstructor) {
    return sanitizeQuiz(quiz, true);
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: { courseId: quiz.courseId, studentId: requestingUser.id },
  });

  if (!enrollment) {
    throw AppError.Forbidden("You must be enrolled in this course to view its quiz");
  }

  return sanitizeQuiz(quiz, false);
}

async function submitQuizAttempt(quizId, studentId, input) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });

  if (!quiz) {
    throw AppError.NotFound("Quiz not found");
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: { courseId: quiz.courseId, studentId: studentId },
  });

  if (!enrollment) {
    throw AppError.Forbidden("You must be enrolled in this course to attempt its quiz");
  }

  const existingAttempt = await prisma.quizAttempt.findUnique({
    where: { studentId_quizId: { studentId: studentId, quizId: quizId } },
  });

  if (existingAttempt) {
    throw AppError.Conflict("You have already attempted this quiz");
  }

  const marksPerQuestion = 1;
  const totalMarks = quiz.questions.length * marksPerQuestion;

  let score = 0;
  for (const question of quiz.questions) {
    const submittedAnswer = input.answers.find((answer) => answer.questionId === question.id);
    if (submittedAnswer && submittedAnswer.answer === question.correctAnswer) {
      score += marksPerQuestion;
    }
  }

  const createdAttempt = await prisma.quizAttempt.create({
    data: {
      quizId: quizId,
      courseId: quiz.courseId,
      studentId: studentId,
      score: score,
      totalMarks: totalMarks,
    },
  });

  return sanitizeAttempt(createdAttempt);
}

async function listQuizAttempts(quizId, instructorId) {
  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });

  if (!quiz) {
    throw AppError.NotFound("Quiz not found");
  }

  await getOwnedCourseOrFail(quiz.courseId, instructorId);

  const attempts = await prisma.quizAttempt.findMany({
    where: { quizId: quizId },
    orderBy: { submittedAt: "desc" },
  });

  return attempts.map(sanitizeAttempt);
}

module.exports = {
  createQuiz,
  updateQuiz,
  getQuizById,
  submitQuizAttempt,
  listQuizAttempts,
};
