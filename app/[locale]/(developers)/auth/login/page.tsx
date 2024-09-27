import {auth, signIn} from "@/lib/auth";
import {redirect} from "next/navigation";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {KeyRoundIcon} from "lucide-react";
import {setContextLocale} from "@/lib/locales/routing";
import LoginSubmitButton from "@/components/util/LoginSubmitButton";
import {getTranslations} from "next-intl/server";

export default async function Login({params, searchParams}: {
  params: { locale: string },
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  setContextLocale(params.locale);

  const session = (await auth());
  const callbackUrl = searchParams.callbackUrl as string | undefined;

  if (session) {
    return redirect(callbackUrl || '/dev');
  }

  const t = await getTranslations('Login');

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
          <CardTitle className="text-2xl flex flex-row items-center">
            <KeyRoundIcon className="mr-2 w-6 h-6" strokeWidth={1.8}/>
            {t('title')}
          </CardTitle>
          <div className="pt-2 text-sm text-muted-foreground space-y-2">
            <p>{t('desc')}</p>
            <p>{t('prompt')}</p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">

        </CardContent>
        <CardFooter>
          <LoginSubmitButton text={t('button')}/>
        </CardFooter>
      </Card>
    </form>
  )
}