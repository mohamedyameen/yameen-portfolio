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

/** Backdrop for recording slots — the dispatch frame from the shared set. */
const BG = '/works/facilio-helpdesk-ai/dispatch.jpg'

/**
 * Story order follows a dispatcher's path: write the rule → see it as
 * structure → test it on a real ticket → watch it recommend → assign or
 * override → the data underneath (technicians, data sources) → how it's built.
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
            Describe how assignment should work in plain English. The agent
            turns it into a policy, scores every candidate, and recommends — or
            auto-assigns — with the reasoning on the surface.
          </Text>
          <Text>
            It ships as its own product for teams that already have tickets:
            Home, Tickets, Technicians, Dispatcher policies, and Ask AI. The
            window above is that product on sample data.
          </Text>
        </Prose>
      </Section>

      <Section id="problem" label="The problem" tocLabel="The problem" className="lg:mt-32">
        <Prose>
          <Text>
            A dispatcher reads a ticket and guesses who is free, close enough,
            and certified. The rules in their head are real — they just live
            nowhere.
          </Text>
          <Text>
            The usual fixes both fail: IF/THEN builders cap what you can say,
            and a text box that returns a black box can&apos;t be trusted.{' '}
            <strong>This rule decides who gets sent to a gas leak.</strong>
          </Text>
        </Prose>
      </Section>

      <Section id="approach" label="The idea" tocLabel="Approach">
        <Prose>
          <Points numbered>
            <Point lead="Write prose.">
              Brief the policy the way you&apos;d brief a new dispatcher.
            </Point>
            <Point lead="Get structure back.">
              Four labelled steps that mirror how the engine actually runs.
            </Point>
            <Point lead="Test before you trust.">
              Run it on a real ticket before it touches a live one.
            </Point>
            <Point lead="Show the reasoning.">
              Every recommendation carries its score, its runners-up, and the
              steps behind it.
            </Point>
          </Points>
        </Prose>
      </Section>

      <Section id="write" label="Write the policy" tocLabel="Write the policy">
        <Prose>
          <Text>
            A blank canvas, a prompt box, a few example chips. Type the rule,
            hit Enter, and you&apos;re on the builder page while the AI drafts.
          </Text>
          <Text>
            Refinement stays conversational: a chat rail on the left, the
            structured breakdown on the right updating as you go.
          </Text>
        </Prose>
        <SceneShot
          src="/works/facilio-dispatcher-agent/policy-canvas.png"
          bg={BG}
          alt="The dispatch policies canvas — a plain-language prompt box above the four existing policies, each with its urgency tier and creation date"
          caption="The rule goes in as a sentence, not a form."
        />
      </Section>

      <Section id="structure" label="Structure, not a black box" tocLabel="Policy breakdown">
        <Prose>
          <Text>The breakdown renders the rule as a pipeline.</Text>
          <Points>
            <Point lead="Trigger.">When it applies, as IF / AND rows.</Point>
            <Point lead="Eligibility.">The hard filter, as chip clusters.</Point>
            <Point lead="Ranking.">
              One weight bar that splits to 100% across skill, proximity,
              availability, performance and cost.
            </Point>
            <Point lead="Assignment.">Who wins.</Point>
          </Points>
        </Prose>
        <SceneShot
          src="/works/facilio-dispatcher-agent/policy-breakdown.png"
          bg={BG}
          alt="A policy breakdown — eligibility as chip clusters, the ranking weight bar split across five factors, assignment, and the fine print"
          caption="Hard filter above, weighted score below — and how the AI read your prompt, in writing."
        />
        <Callout>
          Hard filter versus weighted score is the one idea worth teaching, and
          the layout teaches it without docs. The weight bar avoids red and
          orange — they read as error and warning.
        </Callout>
      </Section>

      <Section id="test" label="Test it on a real ticket" tocLabel="Playground">
        <Prose>
          <Text>
            Open the playground from the builder, pick a real ticket from the
            queue, run the policy. Ranked technicians, a Top match badge,
            nothing saved.
          </Text>
        </Prose>
        <SceneShot
          src="/works/facilio-dispatcher-agent/playground-rankings.png"
          bg={BG}
          alt="The playground with a real ticket loaded and five technicians ranked by score, the highest carrying a Top match badge"
          caption="A real ticket, run through the policy before it goes live."
        />
      </Section>

      <Section id="recommend" label="Trusting the assignment" tocLabel="Recommendation">
        <Prose>
          <Text>
            In the ticket, the card leads with its own state:{' '}
            <strong>&ldquo;Atom recommends&rdquo;</strong> while it waits for
            you, <strong>&ldquo;Auto-assigned&rdquo;</strong> once it has acted.
          </Text>
          <Points>
            <Point lead="A number, not a word.">
              &ldquo;96% match,&rdquo; never &ldquo;high.&rdquo;
            </Point>
            <Point lead="Runners-up with their own scores.">
              Each has an Assign button, so overriding is one scored click.
            </Point>
            <Point lead="How Atom decided.">
              The six engine steps, each shown only if the backend produced
              real reasoning for it.
            </Point>
          </Points>
        </Prose>
        <Video
          src="/works/facilio-helpdesk-ai/ticket-module.mp4"
          caption="The recommendation card, its match score, and the reasoning behind it."
        />
        <SceneShot
          src="/works/facilio-dispatcher-agent/ticket-recommendation.png"
          bg={BG}
          alt="A ticket detail panel — the card reads Auto-assigned by Atom with the technician, the reason, the applied policy, Other matches, and How Atom decided"
          caption="Auto-assigned — then the reason, the policy applied, and the runners-up."
        />
      </Section>

      <Section id="technicians" label="The people it ranks" tocLabel="Technicians">
        <Prose>
          <Text>
            The directory holds exactly what the engine ranks on: skills rated
            1–5, certifications, zones, inventory, breaks, live status, job
            history. The explanation and its data share one vocabulary.
          </Text>
        </Prose>
        <SceneShot
          src="/works/facilio-dispatcher-agent/technician-profile.png"
          bg={BG}
          alt="A technician profile — the day's availability timeline with breaks, skills rated out of five, certifications, applicable territories, and van inventory"
          caption="Skills, certifications, territories, and the day's breaks."
        />
      </Section>

      <Section id="data" label="The system you already run" tocLabel="Data sources">
        <Prose>
          <Text>
            Nothing gets retyped. Data Sources connects the CMMS you already run
            and maps its fields onto the product&apos;s — with coverage shown
            per dataset, so you know what the engine won&apos;t know.
          </Text>
        </Prose>
        <SceneShot
          src="/works/facilio-dispatcher-agent/data-sources.png"
          bg={BG}
          alt="Settings → Data Sources — Facilio listed under connected systems, and four datasets each showing how many of its fields are mapped"
          caption="Connected systems, then every dataset with how much of it is mapped."
        />
        <SceneShot
          src="/works/facilio-dispatcher-agent/dataset-field-mapping.png"
          bg={BG}
          alt="The Add Dataset dialog mapping a Facilio module onto technician fields — breaks, certifications, familiar zones, inventory, contractor flag and skills — with unmapped fields counted"
          caption="Four of ten technician fields filled; the other six left empty on purpose."
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
            ; the first URL segment picks the product.
          </Text>
          <Points>
            <Point lead="A subset, not a fork.">
              Gating is a denylist — Inbox, Contacts, Intake and channel
              settings hidden. A new module appears in both until someone parks
              it.
            </Point>
            <Point lead="Portable by design.">
              All dispatch routing lives in one folder, so it lifts into a
              standalone app with only the shell wiring to redo.
            </Point>
          </Points>
        </Prose>
        <Callout>
          Dispatch jobs and helpdesk tickets are different backends. In the
          product they&apos;re one list, one row, one detail pane — so two
          counts of &ldquo;open work&rdquo; can never disagree.
        </Callout>
      </Section>
    </>
  )
}
