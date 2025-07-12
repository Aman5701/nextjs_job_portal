import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Sidebar from "./sidebar"

const MobileSidebar = () => {
  return (
      <Sheet >
        <SheetTrigger className="md:hidden cursor-pointer pr-4 hover:opacity-75 transition">
          <Menu/>
        </SheetTrigger>
        <SheetContent className="bg-white p-0" side="left">
          <Sidebar/>
        </SheetContent>
      </Sheet>
  )
}

export default MobileSidebar