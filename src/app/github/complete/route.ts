import {NextRequest} from "next/server";
import {redirect} from "next/navigation";
import db from "@/lib/db";
import {sessionLogin} from "@/lib/utils";

async function getAccessToken(code: string) {
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  };
  const formattedParams = new URLSearchParams(params).toString();
  const baseURL = "https://github.com/login/oauth/access_token";
  const accessTokenURL = `${baseURL}?${formattedParams}`;

  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json"
    }
  });

  return await accessTokenResponse.json();
}

async function getGithubProfile(access_token: string) {
  const userProfileResponse = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache", // Next.js는 GET request를 캐시홤 -> 모든 사용자에게 깃허브로그인이 캐시되면 안됨 -> no-cache
  });

  return await userProfileResponse.json();
}

async function getGithubEmail(access_token: string) {
  const userEmailResponse = await fetch("https://api.github.com/user/emails", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  return await userEmailResponse.json();
}

// 브라우저가 페이지를 이동시키는 요청이기 때문에 GET으로 작성
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }

  const {error, access_token} = await getAccessToken(code);

  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const {id, avatar_url, login} = await getGithubProfile(access_token);

  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    }
  });

  if (user) {
    await sessionLogin(user.id);
    return redirect("/profile");
  }

  const userEmailData = await getGithubEmail(access_token);

  const checkUsernameExists = await db.user.findUnique({
    where: {
      username: login,
    },
    select: {
      id: true,
    }
  });

  const newUser = await db.user.create({
    data: {
      username: checkUsernameExists ? login + "_github" : login,
      github_id: id + "",
      avatar: avatar_url,
      email: userEmailData[0].email,
    },
    select: {
      id: true,
    },
  });

  await sessionLogin(newUser.id);
  return redirect("/profile");
}