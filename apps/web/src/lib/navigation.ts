// TODO Expand
function getProjectLink(id: string): string {
  return `/project/${id}`;
}

function getDevProjectLink(id: string): string {
  return `/en/dev/project/${id}`;
}

function authorDashboard(): string {
  return `/dev`;
}

export default {
  getProjectLink,
  getDevProjectLink,
  authorDashboard
}