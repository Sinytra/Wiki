import platforms, {PlatformProject, PlatformProjectAuthor} from "@repo/shared/platforms";
import {getTranslations} from "next-intl/server";

export const ARRNoLicense: string = 'LicenseRef-All-Rights-Reserved';

interface ProjectDisplayInformation {
  authors: PlatformProjectAuthor[];
  latest_version: string;
  license?: { name: string; url: string | null };
}

function getLatestVersion(project: PlatformProject): string | undefined {
  return project.game_versions.length === 0 ? undefined : project.game_versions[project.game_versions.length - 1];
}

export async function getPlatformProjectInformation(project: PlatformProject): Promise<ProjectDisplayInformation> {
  const authors = await platforms.getProjectAuthors(project);
  const t = await getTranslations('DocsProjectInfo');

  const license = !project.license ? undefined
    : project.license.id === ARRNoLicense ? {name: t('license.arr'), url: null}
      : project.license.id.startsWith('LicenseRef') ? {name: t('license.custom'), url: project.license?.url || null}
        : project.license?.name ? {
            name: project.license.name,
            url: project.license?.url ?? `https://spdx.org/licenses/${project.license.name}`
          }
          : undefined;

  return {
    authors,
    latest_version: getLatestVersion(project) || t('latest.unknown'),
    license
  };
}