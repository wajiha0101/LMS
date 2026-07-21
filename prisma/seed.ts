import { PrismaClient, Role, CourseLevel, CourseStatus, MaterialType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);

  // --- Users ---
  const adminPassword = await bcrypt.hash('Admin123!', saltRounds);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.test' },
    update: {},
    create: {
      name: 'Platform Admin',
      email: 'admin@lms.test',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  const instructorPassword = await bcrypt.hash('Instructor123!', saltRounds);
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@lms.test' },
    update: {},
    create: {
      name: 'Jane Instructor',
      email: 'instructor@lms.test',
      passwordHash: instructorPassword,
      role: Role.INSTRUCTOR,
      instructorProfile: {
        create: {
          bio: 'Senior web developer and educator.',
          expertise: 'Web Development',
          credentials: 'MSc Computer Science',
        },
      },
    },
  });

  const studentPassword = await bcrypt.hash('Student123!', saltRounds);
  const student = await prisma.user.upsert({
    where: { email: 'student@lms.test' },
    update: {},
    create: {
      name: 'Sam Student',
      email: 'student@lms.test',
      passwordHash: studentPassword,
      role: Role.STUDENT,
    },
  });

  // --- Category ---
  const category = await prisma.category.upsert({
    where: { name: 'Web Development' },
    update: {},
    create: { name: 'Web Development' },
  });

  // --- Course ---
  // No hardcoded id: let Prisma generate a real UUID via @default(uuid()).
  // Upsert on title instead, since title isn't @unique we simulate idempotency
  // with findFirst + create instead of upsert (upsert requires a unique field).
  let course = await prisma.course.findFirst({
    where: { title: 'Full-Stack Web Development Bootcamp' },
  });

  if (!course) {
    course = await prisma.course.create({
      data: {
        instructorId: instructor.id,
        title: 'Full-Stack Web Development Bootcamp',
        description: 'Learn Node.js, Express, and React from scratch.',
        price: 49.99,
        categoryId: category.id,
        level: CourseLevel.BEGINNER,
        status: CourseStatus.PUBLISHED,
      },
    });
  }

  // --- Materials (so Progress/Wishlist/Cart have something real to point at) ---
  const existingMaterial = await prisma.material.findFirst({
    where: { courseId: course.id, title: 'Introduction to the Course' },
  });

  if (!existingMaterial) {
    await prisma.material.create({
      data: {
        courseId: course.id,
        type: MaterialType.VIDEO,
        title: 'Introduction to the Course',
        contentUrl: 'https://example.com/video1.mp4',
        position: 1,
        duration: 600,
      },
    });
  }

  console.log('Seed complete:', {
    admin: admin.email,
    instructor: instructor.email,
    student: student.email,
    course: course.title,
    courseId: course.id, // <-- use THIS real UUID in Postman, not "seed-course-1"
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });