import {ReactNode, use} from "react";
import {setContextLocale} from "@/lib/locales/routing";

type Params = Promise<{ locale: string }>;

export default function LocaleLayout(props: { params: Params; children: ReactNode; }) {
  const params = use(props.params);
  const {children} = props;
  setContextLocale(params.locale);

  return (
    <div className="page-wrapper-base mx-4 flex min-h-screen flex-col sm:mx-2">
      {children}
    </div>
  );
}
