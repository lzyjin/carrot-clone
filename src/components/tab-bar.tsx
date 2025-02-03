"use client";

import { HomeIcon as HomeIconSolid } from "@heroicons/react/24/solid";
import { HomeIcon as HomeIconOutline } from "@heroicons/react/24/outline";
import { NewspaperIcon as NewspaperIconSolid } from "@heroicons/react/24/solid";
import { NewspaperIcon as NewspaperIconOutline } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftEllipsisIcon as ChatIconSolid } from "@heroicons/react/24/solid";
import { ChatBubbleOvalLeftEllipsisIcon as ChatIconOutline } from "@heroicons/react/24/outline";
import { VideoCameraIcon as VideoCameraIconSolid } from "@heroicons/react/24/solid";
import { VideoCameraIcon as VideoCameraIconOutline } from "@heroicons/react/24/outline";
import { UserIcon as UserIconSolid } from "@heroicons/react/24/solid";
import { UserIcon as UserIconOutline } from "@heroicons/react/24/outline";
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();

  return (
    <div className="bg-neutral-900 fixed bottom-0 w-full mx-auto max-w-screen-sm grid grid-cols-5 border-neutral-600 border-t px-5 py-3
      *:flex *:flex-col *:items-center *:text-white">
      <Link href="/products" className="">
        {
          pathname === "/" ?
          <HomeIconSolid className="size-7"/> :
          <HomeIconOutline className="size-7"/>
        }
        <span>홈</span>
      </Link>
      <Link href="/life" className="">
        {
          pathname === "/life" ?
          <NewspaperIconSolid className="size-7"/> :
          <NewspaperIconOutline className="size-7"/>
        }
        <span>동네생활</span>
      </Link>
      <Link href="/chat" className="">
        {
          pathname === "/chat" ?
          <ChatIconSolid className="size-7"/> :
          <ChatIconOutline className="size-7"/>
        }
        <span>채팅</span>
      </Link>
      <Link href="/live" className="">
        {
          pathname === "/live" ?
          <VideoCameraIconSolid className="size-7"/> :
          <VideoCameraIconOutline className="size-7"/>
        }
        <span>쇼핑</span>
      </Link>
      <Link href="/profile" className="">
        {
          pathname === "/profile" ?
          <UserIconSolid className="size-7"/> :
          <UserIconOutline className="size-7"/>
        }
        <span>나의 당근</span>
      </Link>
    </div>
  );
}