import { Edit, Clock, History } from 'lucide-react'
import Link from "next/link"

interface FooterProps {
    isChangelogOpen: boolean
    toggleChangelog: () => void
}

export default function Footer({ isChangelogOpen, toggleChangelog }: FooterProps) {
    return (
        <footer className="border-t border-border p-4 pt-8 pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-muted-foreground">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-0 sm:mb-0">
                <button onClick={toggleChangelog} className="flex items-center hover:text-accent-foreground">
                    <History className="w-4 h-4 mr-1" />
                    {isChangelogOpen ? "View Documentation" : "View Changelog"}
                </button>
                <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Last updated: 2023-12-09
                </span>
            </div>
            <Link href="#" className="flex items-center hover:text-accent-foreground">
                <Edit className="w-4 h-4 mr-1" />
                Edit this page
            </Link>
        </footer>
    )
}

