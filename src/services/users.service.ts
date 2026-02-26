import prisma from "../db/prisma";
import bcrypt from "bcrypt";

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  });
};

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  });
};

export const createUser = async (data: {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: { ...data, password: hashedPassword },
  });
};

export const updateUser = async (
  id: number,
  data: Partial<{
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    password: string;
  }>,
) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return prisma.user.update({ where: { id }, data });
};

export const deleteUser = async (id: number) => {
  return prisma.user.delete({ where: { id } });
};
