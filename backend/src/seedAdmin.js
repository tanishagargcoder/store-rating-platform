import bcrypt from "bcryptjs";
import prisma from "./lib/prisma.js";

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await prisma.user.upsert({
      where: {
        email: "admin@store.com"
      },
      update: {
        role: "ADMIN"
      },
      create: {
        name: "Store Rating Administrator",
        email: "admin@store.com",
        password: hashedPassword,
        address: "Bennett University, Greater Noida",
        role: "ADMIN"
      }
    });

    console.log("Admin created successfully:");
    console.log({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();