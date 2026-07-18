const { prisma } = require("../../lib/prisma");
const { AppError } = require("../../utils/AppError");

function sanitizeCourse(course) {
  return {
    id: course.id,
    instructorId: course.instructorId,
    title: course.title,
    description: course.description,
    price: course.price,
    categoryId: course.categoryId,
    category: course.category ? { id: course.category.id, name: course.category.name } : undefined,
    level: course.level,
    thumbnailUrl: course.thumbnailUrl,
    status: course.status,
    version: course.version,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
}

async function listCategories() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return categories;
}

async function createCategory(input) {
  const existingCategory = await prisma.category.findUnique({ where: { name: input.name } });

  if (existingCategory) {
    throw AppError.Conflict("A category with this name already exists");
  }

  const createdCategory = await prisma.category.create({
    data: { name: input.name },
  });

  return createdCategory;
}

async function updateCategory(categoryId, input) {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });

  if (!category) {
    throw AppError.NotFound("Category not found");
  }

  const existingCategory = await prisma.category.findUnique({ where: { name: input.name } });

  if (existingCategory && existingCategory.id !== categoryId) {
    throw AppError.Conflict("A category with this name already exists");
  }

  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: { name: input.name },
  });

  return updatedCategory;
}

async function deleteCategory(categoryId) {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });

  if (!category) {
    throw AppError.NotFound("Category not found");
  }

  const coursesUsingCategory = await prisma.course.count({ where: { categoryId: categoryId } });

  if (coursesUsingCategory > 0) {
    throw AppError.Conflict("Cannot delete a category that has courses assigned to it");
  }

  await prisma.category.delete({ where: { id: categoryId } });
}

async function listCourses(query) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;

  const where = {
    status: "PUBLISHED",
  };

  if (query.search) {
    where.title = { contains: query.search, mode: "insensitive" };
  }

  if (query.category) {
    where.categoryId = query.category;
  }

  if (query.level) {
    where.level = query.level;
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {};
    if (query.minPrice !== undefined) {
      where.price.gte = query.minPrice;
    }
    if (query.maxPrice !== undefined) {
      where.price.lte = query.maxPrice;
    }
  }

  const orderBy =
    query.sort === "priceAsc"
      ? { price: "asc" }
      : query.sort === "priceDesc"
      ? { price: "desc" }
      : { createdAt: "desc" };

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.course.count({ where }),
  ]);

  return {
    courses: courses.map(sanitizeCourse),
    meta: { page, limit, total },
  };
}

async function getCourseById(courseId, requestingUser) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { category: true },
  });

  if (!course) {
    throw AppError.NotFound("Course not found");
  }

  if (course.status === "PUBLISHED") {
    return sanitizeCourse(course);
  }

  const isOwner = Boolean(requestingUser) && course.instructorId === requestingUser.id;
  const isAdmin = Boolean(requestingUser) && requestingUser.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw AppError.NotFound("Course not found");
  }

  return sanitizeCourse(course);
}

async function createCourse(instructorId, input) {
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });

  if (!category) {
    throw AppError.BadRequest("Category does not exist");
  }

  const createdCourse = await prisma.course.create({
    data: {
      instructorId: instructorId,
      title: input.title,
      description: input.description,
      price: input.price,
      categoryId: input.categoryId,
      level: input.level,
      thumbnailUrl: input.thumbnailUrl,
    },
    include: { category: true },
  });

  return sanitizeCourse(createdCourse);
}

async function updateCourse(courseId, instructorId, input) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    throw AppError.NotFound("Course not found");
  }

  if (course.instructorId !== instructorId) {
    throw AppError.Forbidden("You do not own this course");
  }

  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category) {
      throw AppError.BadRequest("Category does not exist");
    }
  }

  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: input,
    include: { category: true },
  });

  return sanitizeCourse(updatedCourse);
}

async function deleteCourse(courseId, requestingUser) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    throw AppError.NotFound("Course not found");
  }

  const isOwner = course.instructorId === requestingUser.id;
  const isAdmin = requestingUser.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw AppError.Forbidden("You do not have permission to delete this course");
  }

  await prisma.course.delete({ where: { id: courseId } });
}

async function getCourseStudents(courseId, instructorId) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    throw AppError.NotFound("Course not found");
  }

  if (course.instructorId !== instructorId) {
    throw AppError.Forbidden("You do not own this course");
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { courseId: courseId },
    include: { student: true },
    orderBy: { enrolledAt: "desc" },
  });

  return enrollments.map((enrollment) => ({
    id: enrollment.student.id,
    studentId: enrollment.student.id,
    name: enrollment.student.name,
    email: enrollment.student.email,
    status: enrollment.status,
    progressPercent: enrollment.progressPercent,
    enrolledAt: enrollment.enrolledAt,
    completedAt: enrollment.completedAt,
  }));
}

async function submitCourseForApproval(courseId, instructorId) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    throw AppError.NotFound("Course not found");
  }

  if (course.instructorId !== instructorId) {
    throw AppError.Forbidden("You do not own this course");
  }

  if (course.status !== "DRAFT") {
    throw AppError.Conflict("Only draft courses can be submitted for approval");
  }

  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: { status: "PENDING_APPROVAL" },
    include: { category: true },
  });

  return sanitizeCourse(updatedCourse);
}

async function listCoursesForAdmin(query) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;

  const where = {};
  if (query.status) {
    where.status = query.status;
  }

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.course.count({ where }),
  ]);

  return {
    courses: courses.map(sanitizeCourse),
    meta: { page, limit, total },
  };
}

async function approveCourse(courseId, adminId) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    throw AppError.NotFound("Course not found");
  }

  if (course.status !== "PENDING_APPROVAL") {
    throw AppError.BadRequest("Course is not pending approval");
  }

  const [updatedCourse] = await prisma.$transaction([
    prisma.course.update({
      where: { id: courseId },
      data: { status: "APPROVED" },
      include: { category: true },
    }),
    prisma.courseApproval.create({
      data: {
        courseId: courseId,
        adminId: adminId,
        action: "APPROVED",
      },
    }),
  ]);

  return sanitizeCourse(updatedCourse);
}

async function rejectCourse(courseId, adminId, notes) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    throw AppError.NotFound("Course not found");
  }

  if (course.status !== "PENDING_APPROVAL") {
    throw AppError.BadRequest("Course is not pending approval");
  }

  const [updatedCourse] = await prisma.$transaction([
    prisma.course.update({
      where: { id: courseId },
      data: { status: "REJECTED" },
      include: { category: true },
    }),
    prisma.courseApproval.create({
      data: {
        courseId: courseId,
        adminId: adminId,
        action: "REJECTED",
        notes: notes,
      },
    }),
  ]);

  return sanitizeCourse(updatedCourse);
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  listCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStudents,
  submitCourseForApproval,
  listCoursesForAdmin,
  approveCourse,
  rejectCourse,
};
