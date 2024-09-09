import {auth, signIn} from "@/lib/auth";
import {redirect} from "next/navigation";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {PencilRulerIcon} from "lucide-react";
import {setContextLocale} from "@/lib/locales/routing";
import LoginSubmitButton from "@/components/util/LoginSubmitButton";

export default async function Login({params, searchParams}: { params: { locale: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  setContextLocale(params.locale);

  const session = (await auth());
  const callbackUrl = searchParams.callbackUrl as string | undefined;

  if (session) {
    return redirect(callbackUrl || '/dev');
  }

  return (
    <form
      className="flex w-full h-[50vh] items-center justify-center"
      action={async () => {
        "use server"
        await signIn('github', {redirectTo: callbackUrl || '/dev'})
      }}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex flex-row gap-2 items-center">
            <PencilRulerIcon className="w-6 h-6" strokeWidth={1.8}/>
            Login required
          </CardTitle>
          <CardDescription>
            The page you are trying to access requires you to log in.
            Please use your GitHub account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">

        </CardContent>
        <CardFooter>
          <LoginSubmitButton/>
        </CardFooter>
      </Card>
    </form>
  )
}