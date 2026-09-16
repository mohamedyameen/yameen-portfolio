import Link from 'next/link'
import {
  Text,
  Section,
  Prose,
  Points,
  Point,
  Callout,
  Video,
} from '@/components/works/body'
import { SceneShot } from '@/components/works/SceneShot'
import { HelpdeskBento } from '@/components/works/HelpdeskBento'
import { DesignBuildShowcase } from '@/components/works/DesignBuildShowcase'

/**
 * Story order follows the customer's journey through the product:
 * arrive → set up in minutes → hear the agent → teach it → watch it work
 * (Inbox → Tickets → Contacts → Ask AI) → how it was built.
 *
 * Copy budget: one lead sentence per section, then Points where the content
 * is a list. The title block above already says what the product is.
 */
export default function Body() {
  return (
    <>
      <Section id="what" label="What it is" tocLabel="What it is" className="lg:!mt-0">
        <Prose>
          <Text>
            Two agents do the work; one console lets humans watch and take
            over. The window above is the real console on sample data — click
            through it.
          </Text>
          <Points>
            <Point lead="Intake">
              answers phone, WhatsApp, email and web chat, and raises the ticket.
            </Point>
            <Point lead="Dispatch">
              picks the technician against policies written in plain English.
            </Point>
            <Point lead="The console">
              Inbox, Tickets, Technicians, Contacts, and an Ask AI copilot
              across all of it.
            </Point>
          </Points>
        </Prose>
        <HelpdeskBento />
      </Section>

      <Section id="problem" label="The problem" tocLabel="The problem" className="lg:mt-32">
        <Prose>
          <Text>
            A facilities team&apos;s front door is a phone number and an inbox.
            A tenant calls, someone retypes it into a ticket, and someone else
            guesses which technician is free and certified.
          </Text>
          <Text>
            <strong>The real question was never the screen.</strong> How do you
            get someone to hand a tenant call to an AI — and stay in control
            once they have?
          </Text>
        </Prose>
      </Section>

      <Section id="architecture" label="How it's put together" tocLabel="Architecture">
        <Prose>
          <Text>One pipeline, one surface, one bundle.</Text>
          <Points>
            <Point lead="The pipeline.">Intake → Dispatch does the work.</Point>
            <Point lead="The surface.">
              Inbox, Tickets and Technicians are where a human watches it and
              takes over.
            </Point>
            <Point lead="The nav says it out loud.">
              Modules you <em>operate</em> up top; the agents you <em>tune</em>{' '}
              under &ldquo;Agent Configuration.&rdquo;
            </Point>
            <Point lead="One bundle, two products.">
              The same build serves the{' '}
              <Link href="/works/facilio-dispatcher-agent" className="underline underline-offset-2 hover:text-foreground">
                Dispatcher Agent
              </Link>{' '}
              on its own. The first URL segment picks which one you get.
            </Point>
          </Points>
        </Prose>
      </Section>

      <Section id="onboarding" label="Day one: URL in, agent out" tocLabel="Onboarding">
        <Prose>
          <Text>
            The first screen asks for one thing: your website.
          </Text>
          <Text>
            It crawls the site and comes back pre-filled — company, services,
            tenants, assets, regions — as editable chips. Day one is correcting
            a good guess, not filling a blank form.
          </Text>
        </Prose>
        <Video
          src="/works/facilio-helpdesk-ai/onboarding.mp4"
          caption="Paste a URL, review what it found, land in a live helpdesk."
        />
      </Section>

      <Section id="intake" label="Teaching the agent" tocLabel="Intake agent">
        <Prose>
          <Text>
            Intake is the biggest configuration surface, and what you configure
            is behaviour, not settings.
          </Text>
          <Points>
            <Point lead="Ordered like a call.">
              Identity, Voice, Greeting, Behaviour, Scope of Work, Scenarios,
              then Actions.
            </Point>
            <Point lead="Voices you preview by ear.">
              Scope of Work starts from a template library.
            </Point>
            <Point lead="Scenarios.">
              Question-and-answer pairs that steer the agent on the cases that
              matter.
            </Point>
            <Point lead="One tab per channel.">
              Calls, WhatsApp, Web Widget, Email — each with its own prompt.
            </Point>
          </Points>
        </Prose>
        <SceneShot
          src="/works/facilio-helpdesk-ai/intake-scope-of-work.png"
          bg="/works/facilio-helpdesk-ai/hero.jpg"
          alt="The Intake agent's General tab — Scope of Work listing five plain-English rules, the Scenarios list beneath it, and the Playground panel on the right"
          caption="Scope of Work: the agent's policy in plain English, with the Playground alongside."
        />
        <SceneShot
          src="/works/facilio-helpdesk-ai/intake-add-scenario.png"
          bg="/works/facilio-helpdesk-ai/hero.jpg"
          alt="The Add Scenario dialog — a field for what a user might ask and a field for how the agent should respond"
          caption="A scenario is two fields: what someone might ask, how the agent answers."
        />
      </Section>

      <Section id="playground" label="Talk to it before callers do" tocLabel="Playground">
        <Prose>
          <Text>
            Config on the left, a live phone on the right. It captures your
            mic, streams to the agent, and prints the transcript as it goes.
          </Text>
          <Text>
            <em>Edit → save → talk</em>, instead of edit → save → find your
            phone → call → hope.
          </Text>
        </Prose>
        <SceneShot
          src="/works/facilio-helpdesk-ai/playground-calls.png"
          bg="/works/facilio-helpdesk-ai/hero.jpg"
          alt="The Intake agent's Calls tab — purchased phone numbers on the left, and on the right the Playground's phone showing the agent Ava with a call button"
          caption="Ava on the handset — one tap from a real call."
        />
      </Section>

      <Section id="inbox" label="Every conversation, one inbox" tocLabel="Inbox">
        <Prose>
          <Text>
            Every call, chat and email the agent handled lands here with the
            recording, the transcript, and a summary with a tone read up top.
          </Text>
          <Text>
            Transcripts translate on demand, and the ticket it raised is one
            click away.
          </Text>
        </Prose>
        <SceneShot
          src="/works/facilio-helpdesk-ai/inbox-call-analysis.png"
          bg="/works/facilio-helpdesk-ai/hero.jpg"
          alt="A call open in Inbox — Analyzed by Atom with a Concerned tone read, a one-line summary, and the timestamped transcript below"
          caption="Tone read and summary first — nobody triages from a five-minute transcript."
        />
      </Section>

      <Section id="tickets" label="One queue of work" tocLabel="Tickets">
        <Prose>
          <Text>
            Whatever channel it came from, every request is one row in one
            list, headlined by Atom&apos;s summary.
          </Text>
          <Text>
            The detail slides over the table instead of reflowing it — open six
            tickets without losing your place.
          </Text>
        </Prose>
        <Video
          src="/works/facilio-helpdesk-ai/ticket-module.mp4"
          caption="The queue, and a ticket's detail overlay with the recommended technician inside."
        />
      </Section>

      <Section id="contacts" label="Contacts" tocLabel="Contacts">
        <Prose>
          <Text>
            The directory behind every conversation. A caller who rings twice
            is one record, not two strangers.
          </Text>
        </Prose>
        <Video
          src="/works/facilio-helpdesk-ai/contacts.mp4"
          caption="Contacts — the people behind every conversation."
        />
      </Section>

      <Section id="ask-ai" label="Ask AI" tocLabel="Ask AI">
        <Prose>
          <Text>
            Ask in plain language, get real records back — tickets,
            technicians, policies, trends — each a deep-link into the right
            filtered view.
          </Text>
        </Prose>
        <Video
          src="/works/facilio-helpdesk-ai/ask-ai.mp4"
          caption="Open tickets ranked by urgency, each one a deep-link."
        />
      </Section>

      <Section id="build" label="Designing and building the same screen" tocLabel="Design + build">
        <Prose>
          <Text>
            Rough structure in Figma, the real thing in code with AI doing most
            of the typing, judged in the browser. No handoff, because there was
            nobody to hand off to.
          </Text>
          <Points>
            <Point lead="Three kinds of live.">
              Ask AI streams tokens, the flow builder uses server-sent events,
              the playground holds a WebSocket for voice.
            </Point>
            <Point lead="UI ahead of API.">
              Every unwired call is a marked seam. Controls that can&apos;t act
              yet are disabled, never faked.
            </Point>
          </Points>
        </Prose>
        <DesignBuildShowcase />
        <Callout>
          React 18, TypeScript, Vite, and Facilio&apos;s DSM — Stencil web
          components styled through tokens only. Nav is data, so a module can
          be parked or gated per product in one line.
        </Callout>
      </Section>
    </>
  )
}
