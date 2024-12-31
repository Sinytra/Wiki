import {ImageResponse} from 'next/og'

export const runtime = 'edge'

// Image metadata
export const alt = 'Modded Minecraft Wiki'
export const size = {
  width: 1200,
  height: 630,
}

// noinspection JSUnusedGlobalSymbols
export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
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
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        <img style={{marginBottom: '1.5rem'}} src="https://sinytra.org/logo.png" width={224} height={224}
             alt="Sinytra logo"/>

        <span style={{fontSize: '4rem', marginBottom: '1rem'}}>Modded Minecraft Wiki</span>
        <span style={{color: '#EBEBF599', fontSize: '2.5rem'}}>The Wiki for all of Modded Minecraft</span>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size
    }
  )
}