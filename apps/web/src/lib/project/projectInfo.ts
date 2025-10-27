import platforms, {PlatformProject, PlatformProjectAuthor} from "@repo/shared/platforms";
import {getTranslations} from "next-intl/server";
import {ProjectLicense, ProjectWithInfo} from "@repo/shared/types/service";
import spdxLicenseList from "spdx-license-list";

const ARRNoLicense: string = 'LicenseRef-All-Rights-Reserved';

interface ProjectDisplayInformation {
  authors: PlatformProjectAuthor[];
  latest_version: string;
  licenses: ResolvedLicenses;
}

export interface ResolvedLicense {
  isDefaultArrLicense?: boolean;

  name: string;
  url: string | null;
}

interface ResolvedLicenses {
  project: ResolvedLicense | null;
}

function getLatestVersion(project: PlatformProject): string | undefined {
  return project.game_versions.length === 0 ? undefined : project.game_versions[project.game_versions.length - 1];
}

function resolveLicense(license: ProjectLicense | undefined, fallbackName: string): ResolvedLicense | null {
  if (!license) {
    return null;
  }

  if ('id' in license) {
    const spdxLicense = spdxLicenseList[license.id];
    // Backend should ensure this doesn't happen
    if (!spdxLicense) {
      return { name: fallbackName, url: license.url || null };
    }

    const actualUrl = license.url || spdxLicense.url;
    return { name: spdxLicense.name, url: actualUrl };
  }

  if ('name' in license) {
    return { name: license.name, url: license.url || null };
  }

  return null;
}

function getProjectLicenseInfo(project: ProjectWithInfo, platformProject: PlatformProject, t: (s: string) => string): ResolvedLicenses {
  const customLicenseName = t('license.custom');

  // Use user-defined license
  if (project.info.licenses?.project) {
    return {
      project: resolveLicense(project.info.licenses.project, customLicenseName)
    };
  }

  if (platformProject.license?.id) {
    // All Rights Reserved
    if (platformProject.license.id === ARRNoLicense) {
      return {
        project: { isDefaultArrLicense: true, name: t('license.arr'), url: null }
      }
    }
    // Non-SDPX custom license
    if (platformProject.license.id.startsWith('LicenseRef')) {
      return {
        project: {name: customLicenseName, url: platformProject.license?.url}
      }
    }
    // SPDX License
    const spdxLicense = spdxLicenseList[platformProject.license.id]
    if (spdxLicense) {
      return {
        project: {name: spdxLicense.name, url: platformProject.license?.url || spdxLicense.url}
      }
    }
  }
  // Custom name license
  if (platformProject.license?.name) {
    return {
      project: {
        name: platformProject.license.name,
        url: platformProject.license?.url
      }
    }
  }

  return { project: null };
}

async function getPlatformProjectInformation(project: ProjectWithInfo, platformProject: PlatformProject): Promise<ProjectDisplayInformation> {
  const authors = await platforms.getProjectAuthors(platformProject);
  const t = await getTranslations('DocsProjectInfo');

  return {
    authors,
    latest_version: getLatestVersion(platformProject) || t('latest.unknown'),
    licenses: getProjectLicenseInfo(project, platformProject, t as any)
  };
}

export default {
  getPlatformProjectInformation
}