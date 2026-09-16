import Link from 'next/link'
import {
  Text,
  Section,
  Prose,
  Callout,
  Video,
} from '@/components/works/body'
// Parked with the Verify & call me slot below — restore both together.
// import { ShotPlaceholder } from '@/components/works/ShotPlaceholder'
import { SceneShot } from '@/components/works/SceneShot'
import { HelpdeskBento } from '@/components/works/HelpdeskBento'
import { DesignBuildShowcase } from '@/components/works/DesignBuildShowcase'

/**
 * Story order follows the customer's journey through the product:
 * arrive → set up in minutes → hear the agent → teach it → watch it work
 * (Inbox → Tickets → Contacts → Ask AI) → how it was built.
 *
 * ShotPlaceholder labels double as the recording brief for each slot.
 */
export default function Body() {
  return (
    <>
      <Section id="what" label="What it is" tocLabel="What it is" className="lg:!mt-0">
        <Prose>
          <Text>
            A helpdesk for facilities teams where the work is done by two AI
            agents you configure, not two teams you staff. <strong>Intake</strong>{' '}
            answers phone, WhatsApp, email, and a web widget and raises the
            ticket. <strong>Dispatch</strong> matches the right technician
            against policies written in plain English.
          </Text>
          <Text>
            Around them, one surface for the humans: Inbox, Tickets,
            Technicians, Contacts, and an Ask AI copilot that searches all of
            it. The window above is the real console on sample data — click
            through it.
          </Text>
        </Prose>
        <HelpdeskBento />
      </Section>

      <Section id="problem" label="The problem" tocLabel="The problem" className="lg:mt-32">
        <Prose>
          <Text>
            A facilities team&apos;s front door is a phone number and an inbox.
            A tenant calls about an AC unit; someone retypes it into a ticket,
            and someone else guesses which technician is free and certified.
          </Text>
          <Text>
            Two handoffs, both manual, both lossy. The real design question
            was never the screen. It was <strong>how do you get someone to hand
            a tenant call to an AI, and keep them in control once they have.</strong>
          </Text>
        </Prose>
      </Section>

      <Section id="architecture" label="How it's put together" tocLabel="Architecture">
        <Prose>
          <Text>
            <strong>A pipeline and a surface.</strong> Intake → Dispatch is
            the pipeline. Inbox, Tickets, and Technicians are where a human
            watches it and takes over.
          </Text>
          <Text>
            <strong>The nav says it out loud.</strong> The sidebar splits into
            what you <em>operate</em> and, under &ldquo;Agent Configuration,&rdquo;
            the agents you <em>tune</em>. Configuring an agent and watching it
            work are different jobs.
          </Text>
          <Text>
            <strong>One bundle, two products.</strong> The same build also
            serves the{' '}
            <Link href="/works/facilio-dispatcher-agent" className="underline underline-offset-2 hover:text-foreground">
              Dispatcher Agent
            </Link>{' '}
            as its own product. The first URL segment picks which one you get;
            everything else is shared.
          </Text>
        </Prose>
      </Section>

      <Section id="onboarding" label="Day one: URL in, agent out" tocLabel="Onboarding">
        <Prose>
          <Text>
            An intake agent only works if it knows the business. That&apos;s a
            long form, and it&apos;s the first thing a new customer meets. So the
            first screen asks for one thing: your website.
          </Text>
          <Text>
            It crawls the site and lands on{' '}
            <strong>&ldquo;Here&apos;s What We Found&rdquo;</strong> — company,
            segments, services, tenants, assets, regions, all pre-filled as
            editable chips. &ldquo;Edit any field — your changes always
            win.&rdquo; Day one is correcting a good guess, not filling a blank
            form.
          </Text>
        </Prose>
        <Video
          src="/works/facilio-helpdesk-ai/onboarding.mp4"
          caption="URL in, agent out — the crawl reads the site, “Here’s What We Found” comes back pre-filled, and Looks Good lands you in a live helpdesk."
        />
      </Section>

      <Section id="hear-it" label="Hear it before you trust it" tocLabel="Verify & call me">
        <Prose>
          <Text>
            The first thing after setup isn&apos;t a feature tour. It&apos;s an
            offer to hear the agent you just built. Verify your number and it
            calls you — six OTP cells, one button: <strong>&ldquo;Verify &amp;
            call me.&rdquo;</strong>
          </Text>
          <Text>
            Thirty seconds, skippable, and the highest-conviction moment in the
            product.
          </Text>
        </Prose>
        {/* Hidden until the shot is recorded — uncomment with the import above.
            Recording: the Get Started card on Home -> phone number -> OTP ->
            "Verify & call me" -> the calling state, ideally with the phone
            ringing on camera or the WhatsApp QR variant.
        <ShotPlaceholder
          label='Recording: the Get Started card on Home → phone number → OTP → "Verify & call me" → the calling state, ideally with the phone ringing on camera or the WhatsApp QR variant'
          aspect="16/10"
        /> */}
      </Section>

      <Section id="intake" label="Teaching the agent" tocLabel="Intake agent">
        <Prose>
          <Text>
            Intake is the biggest configuration surface, and what it configures
            is behaviour, not settings. The General tab is ordered the way a
            call unfolds: Identity, Voice, Greeting, Behaviour, Scope of Work,
            Scenarios, end condition — with Actions last.
          </Text>
          <Text>
            Voices are cards you preview by ear. Scope of Work has a template
            library. Scenarios are question-and-answer pairs that steer the
            agent on the cases that matter. Each channel — Calls, WhatsApp,
            Web Widget, Email — gets its own tab and its own prompt.
          </Text>
        </Prose>
        <SceneShot
          src="/works/facilio-helpdesk-ai/intake-scope-of-work.png"
          bg="/works/facilio-helpdesk-ai/hero.jpg"
          alt="The Intake agent's General tab — Scope of Work listing five plain-English rules, the Scenarios list beneath it, and the Playground panel on the right"
          caption="Scope of Work is the agent's policy in plain English, not a settings screen — and the Playground sits beside it the whole time."
        />
        <SceneShot
          src="/works/facilio-helpdesk-ai/intake-add-scenario.png"
          bg="/works/facilio-helpdesk-ai/hero.jpg"
          alt="The Add Scenario dialog — a field for what a user might ask and a field for how the agent should respond"
          caption="A scenario is two fields: what someone might ask, and how the agent should answer it."
        />
      </Section>

      <Section id="playground" label="Talk to it before callers do" tocLabel="Playground">
        <Prose>
          <Text>
            The config sits on the left; a phone sits on the right, and it
            isn&apos;t a mockup. It captures your microphone, streams to the
            agent over a socket, and prints the transcript as it goes. The
            WhatsApp and web-widget previews work the same way.
          </Text>
          <Text>
            That collapses the loop from <em>edit → save → find your phone →
            call → hope</em> to <em>edit → save → talk</em>.
          </Text>
        </Prose>
        <SceneShot
          src="/works/facilio-helpdesk-ai/playground-calls.png"
          bg="/works/facilio-helpdesk-ai/hero.jpg"
          alt="The Intake agent's Calls tab — purchased phone numbers on the left, and on the right the Playground's phone showing the agent Ava with a call button"
          caption="The Calls tab, with the Playground alongside it — Ava on the handset, one tap from a real call."
        />
      </Section>

      <Section id="inbox" label="Every conversation, one inbox" tocLabel="Inbox">
        <Prose>
          <Text>
            Every call, chat, and email the agent handled lands in Inbox with
            the recording, the transcript, and an Atom summary with a tone read
            up top — so nobody triages from a five-minute transcript.
          </Text>
          <Text>
            Transcripts translate into the reader&apos;s language on demand, and
            the ticket raised from the conversation is one click away in both
            directions.
          </Text>
        </Prose>
        <SceneShot
          src="/works/facilio-helpdesk-ai/inbox-call-analysis.png"
          bg="/works/facilio-helpdesk-ai/hero.jpg"
          alt="A call open in Inbox — Analyzed by Atom with a Concerned tone read, a one-line summary, and the timestamped transcript below"
          caption="Every call lands here analysed — the tone read and summary up top, so nobody triages from a five-minute transcript."
        />
      </Section>

      <Section id="tickets" label="One queue of work" tocLabel="Tickets">
        <Prose>
          <Text>
            Whatever channel it came from, every request is one row in one
            list. The AI summary is the headline, credited &ldquo;Summarized by
            Atom.&rdquo; The detail slides over the table instead of reflowing
            it, so you can open six tickets without losing your place.
          </Text>
        </Prose>
        <Video
          src="/works/facilio-helpdesk-ai/ticket-module.mp4"
          caption="The Tickets queue and a ticket’s detail overlay — Atom’s summary up top, the recommended technician and its reasoning inside."
        />
      </Section>

      <Section id="contacts" label="Contacts" tocLabel="Contacts">
        <Prose>
          <Text>
            The directory behind every conversation. A caller who rings twice is
            one record, not two strangers.
          </Text>
        </Prose>
        <Video
          src="/works/facilio-helpdesk-ai/contacts.mp4"
          caption="Contacts — the people directory behind every conversation."
        />
      </Section>

      <Section id="ask-ai" label="Ask AI" tocLabel="Ask AI">
        <Prose>
          <Text>
            Ask in plain language, get the work itself back. Tickets,
            technicians, policies, and trends come back as real records, each a
            deep-link into the right filtered view. Answers stream in; past
            chats stay in the rail.
          </Text>
        </Prose>
        <Video
          src="/works/facilio-helpdesk-ai/ask-ai.mp4"
          caption="Ask AI answering across the product — open tickets ranked by urgency, each one a deep-link."
        />
      </Section>

      <Section id="build" label="Designing and building the same screen" tocLabel="Design + build">
        <Prose>
          <Text>
            Rough structure in Figma, the real thing in code with AI doing most
            of the typing, judged running in the browser. There was no handoff
            because there was nobody to hand off to.
          </Text>
          <Text>
            <strong>Three kinds of live.</strong> Ask AI streams tokens, the
            flow builder uses server-sent events, and the playground holds a
            WebSocket for voice. Almost everything hard here moves, and a
            static frame can&apos;t judge that.
          </Text>
          <Text>
            <strong>UI ahead of API.</strong> Every not-yet-wired call is a
            marked seam that names its route in one line. Controls that
            can&apos;t act yet are disabled, never faked — no mock rows, no
            invented history.
          </Text>
        </Prose>
        <DesignBuildShowcase />
        <Callout>
          The stack: React 18, TypeScript, Vite, and Facilio&apos;s DSM — Stencil
          web components in shadow DOM, styled through tokens only. Nav is
          data, not JSX, so a module can be parked or gated per product in one
          line.
        </Callout>
      </Section>
    </>
  )
}
