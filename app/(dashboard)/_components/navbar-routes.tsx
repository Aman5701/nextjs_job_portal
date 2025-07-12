'use client'

import { Button } from "@/components/ui/button"
import { UserButton, useUser, SignInButton } from "@clerk/nextjs"
import { LogInIcon, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { RiAdminFill } from "react-icons/ri";

export const NavbarRoutes = () => {
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith('/admin');
  const isPlayerPage = pathname.startsWith('/jobs');

  const { user, isLoaded } = useUser();

  if (!isLoaded) return null; // Avoid flickering while loading Clerk state

  return (
    <div className="flex gap-x-2 ml-auto">
      {user ? (
        <>
          {(isAdminPage || isPlayerPage) ? (
            <Link href={"/"}>
              <Button variant="outline" size="sm" className="border-purple-700/20 cursor-pointer">
                <LogOut />
                Exit
              </Button>
            </Link>
          ) : (
            <Link href={"/admin/jobs"}>
              <Button variant="outline" size="sm" className="border-purple-700/20 cursor-pointer">
                <RiAdminFill />
                Admin Mode
              </Button>
            </Link>
          )}
          <UserButton afterSignOutUrl="/" />
        </>
      ) : (
        <SignInButton>
          <Button variant="outline" size="sm" className="border-purple-700/20 cursor-pointer">
          <LogInIcon/>
            Login
          </Button>
        </SignInButton>
      )}
    </div>
  );
};