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
  const course = await prisma.course.upsert({
    where: { id: 'seed-course-1' },
    update: {},
    create: {
      id: 'seed-course-1',
      instructorId: instructor.id,
      title: 'Full-Stack Web Development Bootcamp',
      description: 'Learn Node.js, Express, and React from scratch.',
      price: 49.99,
      categoryId: category.id,
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
    },
  });

  // --- Materials (so Progress/Wishlist/Cart have something real to point at) ---
  await prisma.material.upsert({
    where: { id: 'seed-material-1' },
    update: {},
    create: {
      id: 'seed-material-1',
      courseId: course.id,
      type: MaterialType.VIDEO,
      title: 'Introduction to the Course',
      contentUrl: 'https://example.com/video1.mp4',
      position: 1,
      duration: 600,
    },
  });

  console.log('Seed complete:', { admin: admin.email, instructor: instructor.email, student: student.email, course: course.title });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });