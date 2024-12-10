import { Menu, X, Info } from 'lucide-react'

interface MobileHeaderProps {
  isLeftSidebarOpen: boolean
  isRightSidebarOpen: boolean
  toggleLeftSidebar: () => void
  toggleRightSidebar: () => void
}

export default function MobileHeader({
  isLeftSidebarOpen,
  isRightSidebarOpen,
  toggleLeftSidebar,
  toggleRightSidebar
}: MobileHeaderProps) {
  return (
    <header className="lg:hidden flex justify-between items-center p-4 border-b border-border">
      <button onClick={toggleLeftSidebar} className="text-foreground">
        {isLeftSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      <h1 className="text-lg font-bold">Project Name</h1>
      <button onClick={toggleRightSidebar} className="text-foreground">
        {isRightSidebarOpen ? <X className="w-6 h-6" /> : <Info className="w-6 h-6" />}
      </button>
    </header>
  )
}

