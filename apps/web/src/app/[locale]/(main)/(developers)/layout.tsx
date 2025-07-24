import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";

type Params = Promise<{ locale: string }>;

export default async function ProjectLayout(props: { params: Params; children: ReactNode; }) {
  const params = await props.params;
  const {children} = props;
  setContextLocale(params.locale);

  return (
    <div className="page-wrapper-ext mx-1 flex w-full flex-col items-center">
      <div className="w-full max-w-5xl">
        {children}
      </div>
    </div>
  );
}