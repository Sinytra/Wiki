import { NextRequest } from 'next/server';
import { localService } from '@repo/previewer';
import { ProjectContext } from '@repo/shared/types/service';
import resourceLocation from '@repo/shared/resourceLocation';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { ReadableStream } from 'stream/web';
import env from '@repo/shared/env';

const contentTypes: Record<string, string> = {
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.flac': 'audio/flac',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

export async function GET(request: NextRequest, props: { params: Promise<{ slug: string; id: string }> }) {
  if (env.getLocalDocsRoots() == null) {
    return Response.json({ error: 'asset not found' }, { status: 404 });
  }

  const params = await props.params;
  const ctx: ProjectContext = {
    id: decodeURIComponent(params.slug),
    locale: null,
    version: null
  };
  const location = resourceLocation.parse(decodeURIComponent(params.id));
  if (!location) {
    return Response.json({ error: 'invalid resource location' }, { status: 404 });
  }

  // Local file path to asset file
  const asset = await localService.getLocalAssetFile(location, ctx);
  if (!asset) {
    return Response.json({ error: 'asset not found' }, { status: 404 });
  }

  const stat = await fs.promises.stat(asset);
  const contentType = contentTypes[path.extname(asset).toLowerCase()] ?? 'application/octet-stream';
  const stream = Readable.toWeb(fs.createReadStream(asset)) as ReadableStream<Uint8Array>;

  return new Response(stream as unknown as BodyInit, {
    headers: {
      'Content-Type': contentType,
      'Content-Length': stat.size.toString()
    }
  });
}
