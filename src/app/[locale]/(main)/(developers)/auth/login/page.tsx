import {redirect} from "next/navigation";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@repo/ui/components/card";
import {KeyRoundIcon} from "lucide-react";
import {setContextLocale} from "@/lib/locales/routing";
import LoginSubmitButton from "@/components/util/LoginSubmitButton";
import {getTranslations} from "next-intl/server";
import authSession from "@/lib/authSession";

export default async function Login(
  props: {
    params: Promise<{ locale: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  setContextLocale(params.locale);

  const session = authSession.getSession();
  if (session) {
    const callbackUrl = searchParams.callbackUrl as string | undefined;
    return redirect(callbackUrl || '/dev');
  }

  const t = await getTranslations('Login');

  return (
    <form
      className="flex h-[50vh] w-full items-center justify-center"
      action={async () => {
        "use server"
        authSession.login();
      }}
    >
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader>
          <CardTitle className="flex flex-row items-center text-2xl">
            <KeyRoundIcon className="mr-2 h-6 w-6" strokeWidth={1.8}/>
            {t('title')}
          </CardTitle>
          <div className="text-secondary space-y-2 pt-2 text-sm">
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