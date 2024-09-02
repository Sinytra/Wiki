import {auth, signIn} from "@/lib/auth";
import {redirect} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import GitHubIcon from "@/components/ui/icons/GitHubIcon";
import {PencilRulerIcon} from "lucide-react";
import {setContextLocale} from "@/lib/locales/routing";

export const dynamic = 'force-static';

export default async function Login({params}: { params: { locale: string } }) {
  setContextLocale(params.locale);

  const session = (await auth());

  if (session) {
    return redirect('/dev');
  }

  // TODO Show progress
  return (
    <form
      className="flex w-full h-[50vh] items-center justify-center"
      action={async () => {
        "use server"
        await signIn('github', {redirectTo: '/dev'})
      }}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex flex-row gap-2 items-center">
            <PencilRulerIcon className="w-6 h-6" strokeWidth={1.8} />
            Developer Login
          </CardTitle>
          <CardDescription>
            Login using your GitHub account to access the developer dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">

        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full gap-2 bg-black transition-opacity !opacity-90 hover:bg-neutral-950 hover:!opacity-70 rounded-sm text-white">
            <div className="text-white">
              <GitHubIcon width={16} height={16} />
            </div>
            Log in with GitHub
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}