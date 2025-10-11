import env from "@repo/shared/env";
import {time} from "@repo/shared/constants";

async function getMostPopularProjectIDs(): Promise<string[]> {
  const endpointUrl = env.getPosthogEndpointURL();
  const projectId = env.getPosthogProjectID();
  const apiKey = env.getPosthogAPIKey();
  const indexName = env.getPosthogPopularProjectsIndexName();
  if (!projectId || !apiKey || !indexName || !endpointUrl) {
    return [];
  }

  try {
    const url = `${endpointUrl}/api/projects/${projectId}/query`;
    const body = {
      "query": {
        "kind": "HogQLQuery",
        "query": `select * from ${indexName}`
      }
    };
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body),
      next: {
        tags: ['posthog'],
        revalidate: time.ONE_MONTH
      }
    });
    const json = await resp.json();
    return json.results.map((r: any) => r[0] as string);
  } catch (e) {
    console.error(e);
  }

  return [];
}

export default {
  getMostPopularProjectIDs
}