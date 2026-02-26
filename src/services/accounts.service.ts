import prisma from "../db/prisma";

export const getAccountsByUser = async (userId: number) => {
  return prisma.account.findMany({
    where: { userId },
  });
};

export const getAccountById = async (id: number) => {
  return prisma.account.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, firstname: true, lastname: true, email: true },
      },
    },
  });
};

export const createAccount = async (userId: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Utilisateur non trouvé");

  return prisma.account.create({
    data: { userId },
  });
};

export const deleteAccount = async (id: number) => {
  return prisma.account.delete({ where: { id } });
};
