import express, { Application } from "express";
import prisma from "./db/prisma";
import usersRouter from "./routes/users.routes";
import accountsRouter from "./routes/accounts.routes";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use("/users", usersRouter);
app.use("/users/:userId/accounts", accountsRouter);

async function main() {
  try {
    await prisma.$connect();
    console.log(" Connecté à PostgreSQL");

    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erreur de connexion à la DB :", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();

export default app;
