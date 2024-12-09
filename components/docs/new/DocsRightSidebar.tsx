import { Box, Code2, FileCode2, Github, Globe, CopyrightIcon as License, Tags, User, X } from 'lucide-react'
import Link from "next/link"

interface RightSidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

export default function RightSidebar({ isOpen, toggleSidebar }: RightSidebarProps) {
  return (
    <aside className={`
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      lg:translate-x-0
      ${isOpen ? 'w-64' : 'w-0 lg:w-64'}
      fixed lg:static inset-y-0 right-0 z-75
      transition-all duration-300 ease-in-out
      overflow-hidden border-l border-border bg-background
    `}>
      <div className="h-full p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-secondary/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Project Information</h3>
          <button onClick={toggleSidebar} className="lg:hidden text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Project Icon & Name */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
            <Box className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Project Name</h2>
            <p className="text-xs text-muted-foreground">A brief project description</p>
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-3 text-sm">
          {/* Author */}
          <div className="flex items-center space-x-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span>Author Name</span>
          </div>

          {/* Project Type */}
          <div className="flex items-center space-x-2 text-muted-foreground">
            <FileCode2 className="w-4 h-4" />
            <span>Mod</span>
          </div>

          {/* Latest Version */}
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Code2 className="w-4 h-4" />
            <span>MC 1.20.2</span>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center space-x-2 text-muted-foreground mb-1">
              <Tags className="w-4 h-4" />
              <span>Tags</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {['Technology', 'Automation', 'Magic'].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Licenses */}
          <div>
            <div className="flex items-center space-x-2 text-muted-foreground mb-1">
              <License className="w-4 h-4" />
              <span>Licenses</span>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>Project: MIT</div>
              <div>Wiki: CC BY-SA 4.0</div>
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="flex items-center space-x-2 text-muted-foreground mb-1">
              <Globe className="w-4 h-4" />
              <span>Links</span>
            </div>
            <Link
              href="#"
              className="flex items-center space-x-2 text-primary hover:text-primary/80 text-xs"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}

