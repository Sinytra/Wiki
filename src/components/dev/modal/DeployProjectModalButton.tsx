'use client'

import {HardDriveDownloadIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {useTranslations} from "next-intl";

const DeployProjectModalButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(
  ({ ...props }, ref) => {
    const t = useTranslations('DeployProjectModal');

    return (
      <Button size="sm" ref={ref} {...props}>
        <HardDriveDownloadIcon className="mr-2 size-4"/>
        {t('button')}
      </Button>
    );
  });
DeployProjectModalButton.displayName = 'DeployProjectModalButton';

export default DeployProjectModalButton;