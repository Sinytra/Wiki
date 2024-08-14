import Link from "next/link";

export default function DevStarter() {
  return (
    <div className="flex flex-col gap-6 justify-center items-center">
      <span className="text-muted-foreground text-lg">Looking to add your mod as a developer?</span>

      <Link href="/auth/login">
        <button className="bg-blue-900 p-3 px-5 rounded-sm">Developer login</button>
      </Link>
    </div>
  )
}