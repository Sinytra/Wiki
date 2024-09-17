import Link from "next/link";
import BlogHeader from "@/components/navigation/BlogHeader";

export const dynamic = 'force-static';

function BlogPost({ id, name, desc, date }: { id: string, name: string, desc: string, date: string }) {
  return (
    <div className="border border-neutral-600 px-3 py-2 rounded-sm">
      <div className="flex flex-row items-center justify-between w-full">
        <Link href={`/blog/post/${id}`} className="text-lg !no-underline hover:!underline">
          {name}
        </Link>
        
        <span className="text-muted-foreground">{date}</span>
      </div>

      <span className="font-normal text-muted-foreground">{desc}</span>
    </div>
  )
}

export default async function Preview() {
  return (
    <div className="flex flex-col">
      <BlogHeader />

      <span className="text-xl mb-4 pb-1 border-b">Recent posts</span>
      
      <div>
        <BlogPost
          id="2024-09-10-introduction"
          name="Introducing the Modded Minecraft Wiki!"
          desc="Sinytra is proud to present our latest project in the modding community"
          date="2024-09-10"
        />
      </div>
    </div>
  );
}
