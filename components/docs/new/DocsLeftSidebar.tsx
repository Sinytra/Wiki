import { Book, X } from 'lucide-react'
import Link from "next/link"

interface LeftSidebarProps {
    isOpen: boolean
    toggleSidebar: () => void
}

export default function LeftSidebar({ isOpen, toggleSidebar, sidebarData }: LeftSidebarProps) {
    return (
        <aside className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0
      ${isOpen ? 'w-64' : 'w-0 lg:w-64'}
      fixed lg:static inset-y-0 left-0 z-75
      transition-all duration-300 ease-in-out
      overflow-hidden border-r border-border bg-background
    `}>
            <nav className="h-full p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-secondary/20">
                <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-muted-foreground">Documentation</h3>
                    <button onClick={toggleSidebar} className="lg:hidden text-muted-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {['Getting Started', 'Installation', 'Configuration', 'API Reference', 'Examples', 'Troubleshooting'].map((item) => (
                    <Link
                        key={item}
                        href="#"
                        className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
                    >
                        <Book className="w-4 h-4 mr-2" />
                        {item}
                    </Link>
                ))}
            </nav>
        </aside>
    )
}

