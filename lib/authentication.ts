'use server';
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { defaultSession, SessionData, sessionOptions } from "./session";

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isLoggedIn) session.isLoggedIn = defaultSession.isLoggedIn;
  return session;
}

// export async function getSession() {
//   const cookieStore = await cookies();
//   const cookie = cookieStore.get("yard_management_session")?.value;

//   // Build fake req/res for iron-session
//   const req = {
//     headers: { cookie: `yard_management_session=${cookie || ""}` },
//   } as any;

//   const res = {} as any; // not used for reading session

//   const session = await getIronSession<SessionData>(req, res, sessionOptions);

//   console.log("Session in getSession:", session);

//   if (!session.isLoggedIn) session.isLoggedIn = false;

//   return session;
// }

type LoginState = {
  error?: string;
  loading: boolean;
  ad_login: boolean;
  status: string;
};

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const session = await getSession();
  const formEmail = formData.get("email") as string;
  const formPassword = formData.get("password") as string;
  var callbackUrl = "/";

  const user_ = await prisma.user.findUnique({ where: { email: formEmail } });

  console.log("USER FROM DB: ", user_);

  if (!user_) {
    // User not found
    return { ...prevState, error: "User not found", loading: false, ad_login: false, status: "failed" };
  }

  if (!user_.password) {
    return { ...prevState, error: `No local password set for ${formEmail}`, loading: false, ad_login: false, status: "failed" };
  }

  if(user_.role ==="ADMIN"){
    callbackUrl = "/admin/dashboard";
  } else if(user_.role === "USER"){
    callbackUrl = "/";
  }

  console.log("CALLBACK URL: ", callbackUrl);

  const isPasswordValid = await bcrypt.compare(formPassword, user_.password);
  if (!isPasswordValid) {
    // Wrong password — do NOT clear the form
    return { ...prevState, error: `The password for ${formEmail} is incorrect`, loading: false, ad_login: false, status: "failed" };
  }

  if(!user_.accountActive){
    return { ...prevState, error: `The account for ${formEmail} is not yet active. Please contact admin.`, loading: false, ad_login: false, status: "failed" };
  }

  await prisma.user.update({
    where: { id: user_.id },
    data: { lastLogin: new Date() },
  })

  // Password correct — login user
  session.isLoggedIn = true;
  session.userId = user_.id;
  session.email = user_.email;
  session.name = user_.name || "";
  session.role = user_.role || "";
  await session.save();

  // Redirect on success
  redirect(callbackUrl);

  return { ...prevState, error: undefined, loading: false, ad_login: false, status: "success" };
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect(`/login`);
}