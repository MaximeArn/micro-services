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

export const transferMoney = async (senderId: number, receiverId: number, amount: number) => {
  if (amount <= 0) throw new Error("Le montant doit être positif");
  if (senderId === receiverId) throw new Error("Impossible d'envoyer de l'argent à soi-même");

  return await prisma.$transaction(async (tx: any) => {
    const sender = await tx.account.findUnique({ where: { id: senderId } });
    const receiver = await tx.account.findUnique({ where: { id: receiverId } });
    if (!sender) throw new Error("Compte expéditeur introuvable");
    if (!receiver) throw new Error("Compte destinataire introuvable");
    if (sender.balance < amount) throw new Error("Solde insuffisant");

    // Update balances
    await tx.account.update({
      where: { id: senderId },
      data: { balance: { decrement: amount } },
    });
    await tx.account.update({
      where: { id: receiverId },
      data: { balance: { increment: amount } },
    });

    const exchange = await tx.exchange.create({
      data: {
        senderId,
        receiverId,
        amount,
      },
    });

    // Fetch user info for notification
    const senderUser = await tx.user.findUnique({ where: { id: sender.userId } });
    const receiverUser = await tx.user.findUnique({ where: { id: receiver.userId } });
    // Log notification (simulate email/SMS)
    if (senderUser) {
      console.log(`[NOTIFY] Email/SMS to ${senderUser.email || senderUser.phone}: Vous avez envoyé ${amount}€ au compte #${receiverId}.`);
    }
    if (receiverUser) {
      console.log(`[NOTIFY] Email/SMS to ${receiverUser.email || receiverUser.phone}: Vous avez reçu ${amount}€ du compte #${senderId}.`);
    }
    return exchange;
  });
};

export const getExchanges = async (accountId?: number) => {
  if (accountId) {
    return prisma.exchange.findMany({
      where: {
        OR: [
          { senderId: accountId },
          { receiverId: accountId },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  }
  return prisma.exchange.findMany({ orderBy: { createdAt: "desc" } });
};
