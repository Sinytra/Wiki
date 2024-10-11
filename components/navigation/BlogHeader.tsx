import {Badge} from "@/components/ui/badge";

export default function BlogHeader() {
  return (
    <div
      style={{
        fontSize: 128,
        background: '#1b1b1f',
        color: '#fffff5db',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom: '2.5rem'
      }}
    >
      <img style={{marginBottom: '1.5rem'}} src="https://sinytra.org/logo.png" width={124} height={124}
           alt="Sinytra logo"/>

      <a href="/blog" className="text-foreground !no-underline flex flex-col sm:flex-row items-center"
         style={{fontSize: '2rem', marginBottom: '0.1rem'}}>
        Modded Minecraft Wiki
        <Badge className="ml-3 text-lg" variant="secondary">Blog</Badge>
      </a>
      <span style={{
        color: '#EBEBF599',
        fontSize: '1.5rem'
      }}>The Wiki for all of Modded Minecraft. Presented by Sinytra.</span>
    </div>
  )
}