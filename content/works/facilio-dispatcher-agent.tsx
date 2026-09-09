import { Text, Section, Prose } from '@/components/works/body'

export default function Body() {
  return (
    <>
      <Section id="dispatch" label="Dispatch" tocLabel="Dispatch">
        <Prose>
          <Text>
            The agent coordinates field work — auto-assigning the right technician to each
            work order based on skills, location, and current load, and rebalancing as the
            day changes, so dispatchers steer exceptions instead of routing every ticket
            by hand.
          </Text>
        </Prose>
      </Section>

      {/*
        Drop in real images, videos, or interactive components here.
        Examples (uncomment + add files to public/works/facilio-dispatcher-agent/):

        <Img src="/works/facilio-dispatcher-agent/hero.png" aspect="16/9" alt="Dispatcher Agent hero" priority />
        <TwoCol>
          <Img src="/works/facilio-dispatcher-agent/board.png" aspect="4/3" />
          <Img src="/works/facilio-dispatcher-agent/assign.png" aspect="4/3" />
        </TwoCol>
        <Video src="/works/facilio-dispatcher-agent/demo.mp4" />
      */}
    </>
  )
}
