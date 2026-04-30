import { Heading, Text, Section } from '@/components/works/body'

export default function Body() {
  return (
    <>
      <Section>
        <Heading>Overview</Heading>
        <Text>
          Facilio Atom is the company&apos;s AI application platform for facilities and
          operations teams. I led design for two core AI agents running in live customer
          environments.
        </Text>
      </Section>

      <Section>
        <Heading>The agents</Heading>
        <Text>
          One agent handles support across email, chat, and ticket channels — triaging
          incoming requests and replying with grounded answers. The other coordinates
          field work, auto-assigning the right technician based on skills, location,
          and current load.
        </Text>
      </Section>

      {/*
        Drop in real images, videos, or interactive components here.
        Examples (uncomment + add files to public/works/facilio-atom/):

        <Img src="/works/facilio-atom/hero.png" aspect="16/9" alt="Atom hero" priority />
        <TwoCol>
          <Img src="/works/facilio-atom/agent-a.png" aspect="4/3" />
          <Img src="/works/facilio-atom/agent-b.png" aspect="4/3" />
        </TwoCol>
        <Video src="/works/facilio-atom/demo.mp4" />
        <MyInteractivePrototype />
      */}
    </>
  )
}
