import { cn } from "@/lib/utils";
import { LucideIcon, Lock } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface SidebarRouteItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SidebarRouteItem = ({
  icon: Icon,
  label,
  href,
}: SidebarRouteItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-2 text-neutral-500 text-sm font-[500] pl-6 transition-all hover:text-neutral-600 hover:bg-neutral-300/20",
        isActive &&
          "text-purple-700 bg-purple-200/20 hover:bg-purple-700/20 hover:text-purple-700"
      )}
    >
      <div className="flex items-center gap-x-2 py-4 px-5 cursor-pointer">
        <Icon size={22} className={cn("text-neutral-500", isActive && "text-purple-700")} />
        {label}
        {!user && isLoaded && label !== "Home" && (
          <Lock size={14} className="ml-1 text-neutral-400" />
        )}
      </div>

      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-purple-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};