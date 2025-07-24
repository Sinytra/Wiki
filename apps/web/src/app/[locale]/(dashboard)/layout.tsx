import { ReactNode } from "react";
import { setContextLocale } from "@/lib/locales/routing";

type Params = Promise<{ locale: string }>;

export default async function LocaleLayout(props: { params: Params; children: ReactNode; }) {
  const params = await props.params;
  const {children} = props;
  setContextLocale(params.locale);

  return (
    <div className="page-wrapper-base mx-3 flex min-h-screen flex-col sm:mx-2">
      <div className="flex w-full flex-col items-center px-1">
        {children}
      </div>
    </div>
  );
}
