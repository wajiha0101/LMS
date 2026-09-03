const { prisma } = require("../../lib/prisma");
const { AppError } = require("../../utils/AppError");

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

function sanitizeInstructorProfile(user) {
  return {
    ...sanitizeUser(user),
    bio: user.instructorProfile?.bio ?? null,
    expertise: user.instructorProfile?.expertise ?? null,
    credentials: user.instructorProfile?.credentials ?? null,
  };
}

function sanitizeUserByRole(user) {
  return user.role === "INSTRUCTOR" ? sanitizeInstructorProfile(user) : sanitizeUser(user);
}

function sanitizeOwnProfile(user) {
  const sanitizedUser = sanitizeUser(user);

  if (user.role !== "INSTRUCTOR") {
    return sanitizedUser;
  }

  return {
    ...sanitizedUser,
    instructorProfile: {
      bio: user.instructorProfile?.bio ?? null,
      expertise: user.instructorProfile?.expertise ?? null,
      credentials: user.instructorProfile?.credentials ?? null,
    },
  };
}

async function listUsers(query) {
  const where = {};

  if (query.role) {
    where.role = query.role;
  }

  if (query.status) {
    where.status = query.status;
  }

  const users = await prisma.user.findMany({
    where,
    include: { instructorProfile: true },
    orderBy: { createdAt: "desc" },
  });

  return users.map(sanitizeUserByRole);
}

async function getUserOrFail(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw AppError.NotFound("User not found");
  }

  return user;
}

function ensurePendingInstructor(user) {
  if (user.role !== "INSTRUCTOR" || user.status !== "PENDING") {
    throw AppError.Conflict("User must be a pending instructor");
  }
}

async function approveUser(userId) {
  const user = await getUserOrFail(userId);
  ensurePendingInstructor(user);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: "ACTIVE" },
  });

  return sanitizeUser(updatedUser);
}

async function rejectUser(userId) {
  const user = await getUserOrFail(userId);
  ensurePendingInstructor(user);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: "REJECTED" },
  });

  return sanitizeUser(updatedUser);
}

async function removeUser(userId) {
  await getUserOrFail(userId);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: "SUSPENDED" },
  });

  return sanitizeUser(updatedUser);
}

async function getUserById(targetUserId, requestingUser) {
  const isSelf = requestingUser.id === targetUserId;
  const isAdmin = requestingUser.role === "ADMIN";

  if (!isSelf && !isAdmin) {
    throw AppError.Forbidden("You do not have permission to view this user");
  }

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    include: { instructorProfile: true },
  });

  if (!user) {
    throw AppError.NotFound("User not found");
  }

  return sanitizeUserByRole(user);
}

async function getOwnProfile(userId, requestingUser) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { instructorProfile: true },
  });

  if (!user) {
    throw AppError.NotFound("User not found");
  }

  if (requestingUser.id !== userId) {
    throw AppError.Forbidden("You do not have permission to view this user");
  }

  return sanitizeOwnProfile(user);
}

async function updateOwnProfile(userId, role, input) {
  if (role === "INSTRUCTOR") {
    const profileInput = {
      bio: input.bio,
      expertise: input.expertise,
      credentials: input.credentials,
    };

    await prisma.instructorProfile.upsert({
      where: { userId },
      update: profileInput,
      create: { userId, ...profileInput },
    });
  } else {
    const userInput = {
      name: input.name,
      avatarUrl: input.avatarUrl,
    };

    await prisma.user.update({
      where: { id: userId },
      data: userInput,
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { instructorProfile: true },
  });

  return sanitizeOwnProfile(user);
}

module.exports = {
  listUsers,
  approveUser,
  rejectUser,
  removeUser,
  getUserById,
  getOwnProfile,
  updateOwnProfile,
};
