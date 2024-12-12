'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Edit, Clock, History, Globe, Tag } from 'lucide-react'
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

interface CountryFlagProps {
    flag: string
}

export function CountryFlag({ flag }: CountryFlagProps) {
    return (
        <Image
            src={`/flags/${flag}.svg`}
            alt={`${flag} flag`}
            width={20}
            height={15}
            className="rounded-sm"
        />
    )
}

interface FooterProps {
    isChangelogOpen: boolean
    toggleChangelog: () => void
    locale: string
    version: string
    locales?: Array<{ id: string; name: string; icon: string }>
    versions?: Record<string, string>
}

export default function Footer({ isChangelogOpen, toggleChangelog, locale, version, locales = [], versions = {} }: FooterProps) {
    const [currentLocale, setCurrentLocale] = useState(locale)
    const [currentVersion, setCurrentVersion] = useState(version)
    const pathname = usePathname()
    const router = useRouter()

    const handleLocaleChange = (newLocale: string) => {
        setCurrentLocale(newLocale)
        const parts = pathname.split('/')
        parts[1] = newLocale
        router.push('/' + parts.join('/'))
    }

    const handleVersionChange = (newVersion: string) => {
        setCurrentVersion(newVersion)
        // Here you would typically update the app's version
        // This might involve updating the URL or fetching new content
        console.log(`Version changed to: ${newVersion}`)
    }

    return (
        <footer className="border-t border-border p-4 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center justify-between text-sm text-muted-foreground">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button onClick={toggleChangelog} className="flex items-center hover:text-accent-foreground">
                    <History className="w-4 h-4 mr-1" />
                    {isChangelogOpen ? "View Documentation" : "View Changelog"}
                </button>
                <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Last updated: 2023-12-09
                </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                {locales.length > 0 && (
                    <Select value={currentLocale} onValueChange={handleLocaleChange}>
                        <SelectTrigger className="w-[140px]">
                            <Globe className="w-4 h-4 mr-1" />
                            <SelectValue placeholder="Select locale" />
                        </SelectTrigger>
                        <SelectContent>
                            {locales.map((loc) => (
                                <SelectItem key={loc.id} value={loc.id}>
                                    <Button
                                        variant={currentLocale === loc.id ? 'secondary' : 'ghost'}
                                        size="sm"
                                        className="w-full inline-flex justify-start items-center gap-3"
                                    >
                                        <CountryFlag flag={loc.icon} /> {loc.name}
                                    </Button>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                {Object.keys(versions).length > 0 && (
                    <Select value={currentVersion} onValueChange={handleVersionChange}>
                        <SelectTrigger className="w-[140px]">
                            <Tag className="w-4 h-4 mr-1" />
                            <SelectValue placeholder="Select version" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(versions).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                    {value}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                <Link href="#" className="flex items-center hover:text-accent-foreground">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit this page
                </Link>
            </div>
        </footer>
    )
}