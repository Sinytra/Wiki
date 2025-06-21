'use client'

import {Button} from "@repo/ui/components/button";
import * as React from "react";
import {useRef} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {ruleProjectReportSchema} from "@/lib/forms/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {useTranslations} from "next-intl";
import usePageDataReloadTransition from "@repo/shared/client/usePageDataReloadTransition";
import {useRouter} from "@/lib/locales/routing";

interface Params {
  disabled: boolean;
  children: any;
  formAction: (data: any) => Promise<any>;
}

type Schema = z.infer<typeof ruleProjectReportSchema>;

export default function RuleReportForm({disabled, children, formAction}: Params) {
  const t = useTranslations('ViewReportPage');
  const router = useRouter();
  const reload = usePageDataReloadTransition();

  const form = useForm<Schema>({
    resolver: zodResolver(ruleProjectReportSchema)
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const resp = await formAction(data);

    if (resp.success) {
      toast.success(t(`toast.${data.resolution}`));

      reload(() => router.refresh());
    } else {
      console.error(resp);
    }
  }

  function submitForm(resolution: Schema['resolution']) {
    form.setValue('resolution', resolution);

    formRef.current!.requestSubmit();
  }

  return (
    <form inert={disabled} ref={formRef} className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      {children}

      {!disabled &&
        <div className="justify-end flex flex-row items-center gap-4">
            <Button variant="secondary" type="button" onClick={submitForm.bind(null, 'dismiss')}>
              {t('actions.dismiss')}
            </Button>

            <Button type="button" onClick={submitForm.bind(null, 'accept')}>
              {t('actions.accept')}
            </Button>
        </div>
      }
    </form>
  )
}