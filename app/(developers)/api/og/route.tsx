import {NextRequest, NextResponse} from "next/server";
import {ImageResponse} from "next/og";
import platformsFacade, {ModProject} from "@/lib/facade/platformsFacade";
import sources from "@/lib/docs/sources";
import sharp from "sharp";
import markdown from "@/lib/markdown";
import assets, {AssetLocation} from "@/lib/docs/assets";

export const runtime = 'nodejs';

const size = {
  width: 1200,
  height: 630,
}

async function projectPageImage(project: ModProject) {
  const getImageBase64 = async (url: string) => {
    const resp = await fetch(url);
    const buf = await resp.arrayBuffer();

    const buffer = await sharp(buf).toFormat('png').toBuffer()
    return {
      url: `data:${'image/png'};base64,${buffer.toString('base64')}`,
    };
  };

  const acualUrl = project.icon_url.endsWith('.webp') ? (await getImageBase64(project.icon_url)).url : project.icon_url;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: '#1b1b1f',
          color: '#fffff5db',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: '56%',
          gap: '1rem',
          marginTop: '1.5rem',
          marginLeft: '2rem'
        }}>
          <img src={acualUrl} width={196} height={196} alt={project.name}/>

          <span style={{
            paddingTop: '1.6rem',
            fontSize: '4.5rem',
            overflowX: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '66rem'
          }}>
            {project.name}
          </span>
        </div>

        <hr style={{
          height: '1px',
          border: '1px solid #EBEBF599',
          width: '100%',
          marginBottom: '2rem',
          marginTop: '4rem'
        }}/>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '5rem',
          marginRight: '4rem'
        }}>
          <img src="https://sinytra.org/logo.png" width={128} height={128}
               alt="Sinytra logo"/>

          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <span style={{fontSize: '3rem', marginBottom: '1rem'}}>Modded Minecraft Wiki</span>
            <span style={{color: '#EBEBF599', fontSize: '2rem'}}>The Wiki for all of Modded Minecraft</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}

function docsEntryPageResponse(mod: string, title: string, iconUrl: AssetLocation | null) {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: '#1b1b1f',
          color: '#fffff5db',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: '60%',
          gap: '1rem',
        }}>
          {iconUrl ? <img src={iconUrl.src} width={196} height={196} alt={title}/>
            : <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5ODk4OWYiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZpbGUtdGV4dCI+PHBhdGggZD0iTTE1IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3WiIvPjxwYXRoIGQ9Ik0xNCAydjRhMiAyIDAgMCAwIDIgMmg0Ii8+PHBhdGggZD0iTTEwIDlIOCIvPjxwYXRoIGQ9Ik0xNiAxM0g4Ii8+PHBhdGggZD0iTTE2IDE3SDgiLz48L3N2Zz4="
                   style={{width: 168, height: 168, marginTop: '1.6rem'}} alt="Document" />
          }

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            width: '45rem',
            textAlign: 'center'
          }}>
            <span style={{
              fontSize: '3.5rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '50rem'
            }}>
              {title}
            </span>
            <span style={{
              color: '#EBEBF599',
              fontSize: '2.5rem',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '50rem',
              overflow: 'hidden'
            }}>
                ({mod})
              </span>
          </div>
        </div>

        <hr style={{
          height: '1px',
          border: '1px solid #EBEBF599',
          width: '100%',
          marginBottom: '2rem',
          marginTop: '4rem'
        }}/>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '5rem',
          marginRight: '4rem'
        }}>
          <img src="https://sinytra.org/logo.png" width={128} height={128}
               alt="Sinytra logo"/>

          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <span style={{fontSize: '3rem', marginBottom: '1rem'}}>Modded Minecraft Wiki</span>
            <span style={{color: '#EBEBF599', fontSize: '2rem'}}>The Wiki for all of Modded Minecraft</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}

export async function GET(req: NextRequest) {
  const {searchParams} = req.nextUrl;
  const slug = searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({'error': 'Missing slug parameter'}, {status: 400})
  }

  const source = await sources.getProjectSource(slug);
  const project = await platformsFacade.getPlatformProject(source.platform, source.slug);

  const pathVal = searchParams.get('path');
  if (!pathVal) {
    return projectPageImage(project);
  }

  const locale = searchParams.get('locale') || 'en';

  const path = pathVal.split('/');
  const metadata = await markdown.readDocumentationFileMetadata(source, path, locale);
  const iconUrl: AssetLocation | null = metadata.hide_icon === true || !metadata.icon && !metadata.id ? null : await assets.getAssetResource((metadata.icon || metadata.id)!, source);

  return docsEntryPageResponse(project.name, metadata.title || 'funny', iconUrl);
}