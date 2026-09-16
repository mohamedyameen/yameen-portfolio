import Link from 'next/link'
import {
  Text,
  Section,
  Prose,
  Callout,
  Video,
} from '@/components/works/body'
import { ShotPlaceholder } from '@/components/works/ShotPlaceholder'

/** Backdrop for recording slots — the dispatch frame from the shared set. */
const BG = '/works/facilio-helpdesk-ai/dispatch.jpg'

/**
 * Story order follows a dispatcher's path: write the rule → see it as
 * structure → test it on a real ticket → watch it recommend → assign or
 * override → the data underneath (technicians, data sources) → how it's built.
 *
 * ShotPlaceholder labels double as the recording brief for each slot.
 */
export default function Body() {
  return (
    <>
      <Section id="what" label="What it is" tocLabel="What it is" className="lg:!mt-0">
        <Prose>
          <Text>
            An AI agent that assigns field technicians to work orders. You
            describe how assignment should work in plain English; it turns that
            into a policy, scores every candidate, and recommends — or
            auto-assigns — the right person with the reasoning on the surface.
          </Text>
          <Text>
            It ships as its own product for teams that already have tickets and
            just need the assignment automated: Home, Tickets, Technicians,
            Dispatcher policies, and a ticket-focused Ask AI. The window above
            is that product, running on sample data.
          </Text>
        </Prose>
      </Section>

      <Section id="problem" label="The problem" tocLabel="The problem" className="lg:mt-32">
        <Prose>
          <Text>
            A dispatcher reads a ticket and guesses who is free, close enough,
            and actually certified. The rules in their head are real — severity
            thresholds, after-hours cover, travel limits, workload — but they
            live nowhere.
          </Text>
          <Text>
            The usual fixes both fail. A visual IF/THEN builder is miserable and
            caps what you can express. A text box that returns a black box is
            easy to write and impossible to trust. And this rule decides who
            gets sent to a gas leak.
          </Text>
        </Prose>
      </Section>

      <Section id="approach" label="The idea" tocLabel="Approach">
        <Prose>
          <Text>
            <strong>Write prose.</strong> Describe the policy the way you&apos;d
            brief a new dispatcher.
          </Text>
          <Text>
            <strong>Get structure back.</strong> The AI returns the rule as four
            labelled steps that mirror how the engine actually runs.
          </Text>
          <Text>
            <strong>Test before you trust.</strong> Run it against a real ticket
            and see who it picks — before it touches a live request.
          </Text>
          <Text>
            <strong>Show the reasoning.</strong> Every recommendation carries
            its score, its runners-up, and the steps behind it.
          </Text>
        </Prose>
      </Section>

      <Section id="write" label="Write the policy" tocLabel="Write the policy">
        <Prose>
          <Text>
            Policies start on a blank canvas with a prompt box and a few
            example chips. Type the rule, hit Enter, and you&apos;re already on
            the builder page while the AI drafts — the same optimistic handoff
            Ask AI uses.
          </Text>
          <Text>
            Refinement stays conversational: a chat rail on the left keeps
            taking follow-ups, and the structured breakdown on the right
            updates.
          </Text>
        </Prose>
        <ShotPlaceholder
          bg={BG}
          label='Recording: Dispatcher → policies canvas — type "Emergency HVAC tickets go to certified techs within 15 km, prefer lowest workload", Enter, the builder drafts, then refine once via the chat rail'
          aspect="16/10"
        />
      </Section>

      <Section id="structure" label="Structure, not a black box" tocLabel="Policy breakdown">
        <Prose>
          <Text>
            The breakdown renders the rule as a pipeline. <strong>Trigger</strong>{' '}
            — when it applies, as IF / AND rows. <strong>Eligibility</strong> —
            the hard filter, as chip clusters. <strong>Ranking</strong> — the
            weighted score, as one bar that splits to 100% across skill,
            proximity, availability, performance, and cost.{' '}
            <strong>Assignment</strong> — who wins.
          </Text>
          <Text>
            The split between a hard filter and a weighted score is the one
            thing worth teaching, and the layout teaches it without docs.
          </Text>
        </Prose>
        <ShotPlaceholder
          bg={BG}
          label="Recording: scroll the policy breakdown — the stat pills, Trigger rows, Eligibility chips, the Ranking weight bar with its factor rows, Assignment, then expand the AI assumptions card"
          aspect="16/10"
        />
        <Callout>
          The weight bar deliberately avoids red and orange. They read as
          error and warning — the wrong message for a weighting.
        </Callout>
      </Section>

      <Section id="test" label="Test it on a real ticket" tocLabel="Playground">
        <Prose>
          <Text>
            From the builder, open the playground, pick a real ticket from the
            queue, and run the policy against it. Nothing is saved. You see the
            technicians it would recommend, with a Top match badge, validated
            against reality before the rule goes live.
          </Text>
        </Prose>
        <ShotPlaceholder
          bg={BG}
          label="Recording: Test rule → the modal morphs to the ticket picker → choose a ticket → back to the playground with ranked technicians and the Top match badge"
          aspect="16/10"
        />
      </Section>

      <Section id="recommend" label="Trusting the assignment" tocLabel="Recommendation">
        <Prose>
          <Text>
            In the ticket, the card leads with its own state:{' '}
            <strong>&ldquo;Atom recommends&rdquo;</strong> when it&apos;s waiting
            for you, <strong>&ldquo;Auto-assigned&rdquo;</strong> when it already
            acted. Then three things: a score stated as a number
            (&ldquo;96% match,&rdquo; not &ldquo;high&rdquo;), the ranked
            runners-up with their own scores and Assign buttons, and{' '}
            <strong>&ldquo;How Atom decided.&rdquo;</strong>
          </Text>
          <Text>
            That expands into the six steps the engine walked — request
            analyzed, policy matched, requirements extracted, candidates
            filtered, scoring calculated, assignment finalized — each shown only
            if the backend produced real reasoning for it. Overriding is one
            scored click.
          </Text>
        </Prose>
        <Video
          src="/works/facilio-helpdesk-ai/ticket-module.mp4"
          caption="A ticket’s detail — the recommendation card with its match score, and the reasoning behind it."
        />
        <ShotPlaceholder
          bg={BG}
          label='Recording: open a recommended ticket → the card with "96% match" → Other matches popover → expand "How Atom decided" → assign a runner-up (override) → the card flips to Assigned'
          aspect="16/10"
        />
      </Section>

      <Section id="technicians" label="The people it ranks" tocLabel="Technicians">
        <Prose>
          <Text>
            The technician directory holds exactly what the engine ranks on:
            skills rated 1–5, certifications, familiar zones, inventory, breaks
            across the day, live status, and job history. The explanation and
            its data speak the same vocabulary.
          </Text>
        </Prose>
        <ShotPlaceholder
          bg={BG}
          label="Recording: Technicians card grid → search → open a profile modal → skills with ratings, certifications, the breaks timeline, familiar zones, then the job history"
          aspect="16/10"
        />
      </Section>

      <Section id="data" label="The system you already run" tocLabel="Data sources">
        <Prose>
          <Text>
            Technicians and tickets don&apos;t get retyped. Data Sources
            connects the CMMS you already use — Facilio today, more in the
            catalogue — and each dataset maps source fields onto the
            product&apos;s. Field coverage shows per dataset, so you can see
            what the engine will and won&apos;t know about.
          </Text>
        </Prose>
        <ShotPlaceholder
          bg={BG}
          label="Recording: Settings → Data Sources — connected systems, the datasets list with its field coverage and review counts, then one dataset's source-to-destination field mapping"
          aspect="16/10"
        />
      </Section>

      <Section id="architecture" label="How it's built" tocLabel="Architecture">
        <Prose>
          <Text>
            <strong>One bundle, two products.</strong> The Dispatcher is served
            from the same build as the{' '}
            <Link href="/works/facilio-helpdesk-ai" className="underline underline-offset-2 hover:text-foreground">
              Helpdesk
            </Link>
            . The first URL segment selects the product: its base path, its
            landing route, its Atom application id, and the modules it hides.
          </Text>
          <Text>
            <strong>A subset, not a fork.</strong> Gating is a denylist. The
            Dispatcher hides Inbox, Contacts, Intake, and channel settings; a
            module added later appears in both until someone parks it, rather
            than silently missing from one.
          </Text>
          <Text>
            <strong>Portable by design.</strong> All dispatch routing lives in
            one folder, so the whole module can lift into a standalone app with
            only the shell wiring to redo. It began life that way — as a
            standalone dispatcher — was ported into the helpdesk, unified on
            Tickets, and then the helpdesk bundle was taught to serve it as its
            own product again.
          </Text>
        </Prose>
        <Callout>
          Dispatch jobs and helpdesk tickets are different backends with
          different ids. In the product they&apos;re one list, one row, one
          detail pane — vocabularies reconciled by hand so the two counts of
          &ldquo;open work&rdquo; can never disagree.
        </Callout>
      </Section>

      <Section id="close" label="What held it together" tocLabel="Reflection" className="lg:mt-40">
        <Prose>
          <Text>
            <strong>Explainability is an interface problem, not a model
            problem.</strong> The score, the runners-up, and the reasoning steps
            were design decisions. Auditable is the only version of AI
            automation that gets adopted.
          </Text>
          <Text>
            <strong>Prose in → structure out → test</strong> is the pattern
            I&apos;d most want to reuse: natural language for input, structured
            rendering so the interpretation is inspectable, a dry-run before
            it&apos;s live.
          </Text>
        </Prose>
      </Section>
    </>
  )
}
