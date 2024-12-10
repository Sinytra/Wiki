interface ChangelogEntry {
    version: string
    date: string
    changes: string[]
}

interface ChangelogProps {
    entries: ChangelogEntry[]
}

export default function Changelog({ entries }: ChangelogProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Changelog</h2>
            {entries.map((entry, index) => (
                <div key={index} className="border-b border-border pb-4">
                    <h3 className="text-lg font-semibold">{entry.version} <span className="text-sm text-muted-foreground">({entry.date})</span></h3>
                    <ul className="list-disc list-inside mt-2">
                        {entry.changes.map((change, changeIndex) => (
                            <li key={changeIndex} className="text-muted-foreground">{change}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}

