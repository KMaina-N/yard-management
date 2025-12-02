import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sendAdminPendingVerificationEmail, sendUserPendingVerificationEmail } from "@/services/accounts";
// Removed: import { decode } from "base64-arraybuffer";
// import { sendVerification } from "@/lib/send-mail";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("DATA: ", body);
  const { name, email, company, password } = body;
  const username = email.split("@")[0].replace(".", "");
  const hashedPassword = await bcrypt.hash(password, 12);

  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      company,
      password: hashedPassword,
      role: "USER",
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }

  const adminUsers = await prisma.user.findMany({
    where: { role: "ADMIN" },
  });

  await sendUserPendingVerificationEmail({ to: email, userName: name });

  // send email to admins
  for (const admin of adminUsers) {
    await sendAdminPendingVerificationEmail({ to: admin.email, userName: name, userEmail: email, userCompany: company });
  }

  return NextResponse.json("User registered successfully", { status: 201 });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const decodedId = Buffer.from(token as string, "base64").toString("utf-8");

    const user = await prisma.user.update({
      where: { id: decodedId },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error updating user: ", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
