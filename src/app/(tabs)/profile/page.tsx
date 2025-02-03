import db from "@/lib/db";
import getSession from "@/lib/session";
import {notFound, redirect} from "next/navigation";

async function getUser() {
  const session = await getSession();

  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });

    if (user) {
      return user;
    }

    notFound();
  }
}

export default async function Profile() {
  const user = await getUser();

  const logOut = async () => {
    "use server";

    const session = await getSession();
    session.destroy();
    redirect("/");
  }

  return (
    <div>
      <h1>{user?.username}님, 환영합니다. :)</h1>
      <form action={logOut}>
        <button>로그아웃</button>
      </form>
    </div>

  );
}