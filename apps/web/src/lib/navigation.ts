// TODO Expand
function getProjectLink(id: string): string {
  return `/project/${id}`;
}

function getDevProjectLink(id: string): string {
  return `/en/dev/project/${id}`;
}

export default {
  getProjectLink,
  getDevProjectLink
}