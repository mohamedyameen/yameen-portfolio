import {
  Text,
  Section,
  Prose,
  Heading,
  Callout,
  Video,
} from '@/components/works/body'
import { ShotPlaceholder } from '@/components/works/ShotPlaceholder'
import { HelpdeskBento } from '@/components/works/HelpdeskBento'
import { DesignBuildShowcase } from '@/components/works/DesignBuildShowcase'

export default function Body() {
  return (
    <>
      <Section id="what" label="What it is" tocLabel="What it is" className="lg:!mt-0">
        <Prose>
          <Text>
            A helpdesk for facilities and property-management teams, where the
            work is done by three AI agents you configure rather than three
            teams you staff. An <strong>Intake agent</strong> answers the phone,
            WhatsApp, email, and a web widget, taking the request in the
            caller&apos;s own words and raising a ticket. A{' '}
            <strong>Dispatch agent</strong> reads that ticket against policies
            you wrote in plain English and recommends — or auto-assigns — the
            right technician. A <strong>Feedback agent</strong> closes the loop
            after the fix.
          </Text>
          <Text>
            Wrapped around the three is one operational surface for the humans:
            an Inbox of every conversation with transcripts, recordings and
            tone; a Tickets list; a Technicians directory; Contacts; and Ask AI,
            which searches the whole thing and deep-links you into it. I led
            design, copy, and the frontend across all eleven modules.
          </Text>
        </Prose>
        <HelpdeskBento />
      </Section>

      <Section id="problem" label="The problem" tocLabel="The problem" className="lg:mt-32">
        <Prose>
          <Text>
            A facilities team&apos;s front door is a phone number and an inbox. A
            tenant calls about an AC unit; someone retypes what they heard into a
            ticket, losing detail on the way. Someone else guesses which
            technician is free, close enough, and actually certified. Then nobody
            asks whether the fix landed — unless the tenant calls back angry.
          </Text>
          <Text>
            Three handoffs, all manual, all lossy. The product&apos;s bet:
            replace each handoff with a configurable agent, and give the team one
            place to watch all three and correct them when they&apos;re wrong. So
            the design problem was almost never &ldquo;what should this screen
            look like.&rdquo; It was <strong>how do you get someone to hand a
            tenant call to an AI, and keep them in control once they have.</strong>
          </Text>
        </Prose>
      </Section>

      <Section id="onboarding" label="URL in, agent out" tocLabel="Onboarding">
        <Prose>
          <Text>
            An intake agent only works if it knows the business — buildings,
            services, tenant types, regions, assets. That&apos;s a long form, and
            it&apos;s the very first thing a new customer meets. A blank six-field
            screen on day one, before any value is shown, is where trials go to
            die.
          </Text>
          <Text>
            So the first screen makes a promise before it asks for anything —{' '}
            <strong>&ldquo;Your Facilities, on Autopilot. Finally.&rdquo;</strong>{' '}
            — then asks for one thing: your website URL.
            &ldquo;Finally&rdquo; is the load-bearing word; it speaks to someone
            who has already tried to solve this and is tired. You watch it crawl —
            rotating status lines keep a genuinely slow read feeling attended-to —
            then land on{' '}
            <strong>&ldquo;Here&apos;s What We Found&rdquo;</strong>: company,
            segments, services, tenant types, assets, regions, all pre-filled,
            all editable. The whole contract sits in one subtitle:{' '}
            <strong>&ldquo;Edit any field — your changes always win.&rdquo;</strong>
          </Text>
        </Prose>
        <ShotPlaceholder
          label='Onboarding — the "Here’s What We Found" step, pre-filled chips across six questions with the "your changes always win" subtitle'
          aspect="16/10"
        />
        <Prose>
          <Text>
            Every field is a <strong>question, not a label</strong>: <em>&ldquo;What&apos;s
            your company name?&rdquo;</em>, <em>&ldquo;Who are your tenants?&rdquo;</em>,{' '}
            <em>&ldquo;What assets do you manage?&rdquo;</em> — because the screen
            is a conversation about your business, and it quietly sets up the
            product&apos;s whole premise: you configure this thing by describing
            your work in your own words. Nothing is client-side state either —
            every keystroke autosaves, so a resumed session lands exactly where
            you left it, and the failure case is a first-class view, not a toast:{' '}
            <em>&ldquo;We Couldn&apos;t Read Your Site&rdquo;</em>, retry or fill
            it in yourself.
          </Text>
        </Prose>
        <Prose>
          <Heading>Then: prove it works before asking anyone to trust it</Heading>
          <Text>
            Submitting is a build, not a spinner — <em>&ldquo;Configuring your AI
            agent&rdquo;</em> drops you into Ask AI rather than an empty
            dashboard, because the useful first move is asking the product
            something, not surveying a bare helpdesk. And the very first thing
            after that isn&apos;t a feature tour — it&apos;s an offer to{' '}
            <strong>hear the thing you just built.</strong> You verify your phone
            number, and your own agent calls you: six OTP cells, one button —{' '}
            <strong>&ldquo;Verify &amp; call me.&rdquo;</strong>
          </Text>
          <Text>
            That&apos;s the highest-conviction moment in the whole product and it
            costs thirty seconds — nothing on a welcome screen competes with an AI
            agent phoning you and handling a maintenance request in your own
            language. It&apos;s skippable (<em>&ldquo;Explore My Own&rdquo;</em>),
            because a demo you can&apos;t decline is a hostage situation. The first
            thing a customer does is <strong>correct</strong> an agent that
            already understands their business, not <strong>build</strong> one
            from nothing.
          </Text>
        </Prose>
        <ShotPlaceholder
          label='Post-onboarding — the "Verify & call me" screen: six OTP cells and one button, where your own agent phones you to demo itself'
          aspect="16/10"
        />
      </Section>

      <Section
        id="personality"
        label="Configuring a personality"
        tocLabel="The intake agent"
      >
        <Prose>
          <Text>
            The Intake agent is the biggest configuration surface in the product,
            and what it configures isn&apos;t settings — it&apos;s behaviour. How
            it sounds, how it opens, what it&apos;s allowed to handle, where it
            draws the line, when it hangs up.
          </Text>
          <Text>
            So the General tab is ordered the way a call unfolds — Identity,
            Greeting, Behaviour, Scope of Work, Scenarios, end condition, closing
            message — with Actions deliberately last, because everything above is
            who the agent <em>is</em> and that&apos;s what it can <em>do</em>.
            Read the section subtitles as a sequence and you&apos;ve been taught
            the mental model of a voice agent without a line of documentation.
          </Text>
          <Text>
            The hardest field gets the most help: Scope of Work has a template
            library for the common case and a Draft-With-AI path for the long
            tail. Voices are cards you preview by ear, not names in a dropdown.
            And publishing is explicit — one <strong>Save And Publish</strong>,
            disabled until something changed, because agent behaviour is live to
            callers and shouldn&apos;t drift on autosave.
          </Text>
        </Prose>
        <ShotPlaceholder
          label="Intake General tab — the conversation-arc sections on the left, with the live call playground on the right"
          aspect="16/10"
        />
        <Prose>
          <Heading>Closing the feedback gap</Heading>
          <Text>
            The config sits on the left; a phone mockup sits on the right — and
            it isn&apos;t a mockup of a call. It captures your microphone, streams
            to the agent over a socket, plays the response back, and prints the
            transcript as it goes. A real conversation with the agent you just
            configured, in the browser, no phone involved. That collapses the loop
            from <em>edit → save → find your phone → call → hope</em> down to{' '}
            <em>edit → save → talk.</em>
          </Text>
        </Prose>
      </Section>

      <Section
        id="dispatch"
        label="Trusting an AI assignment"
        tocLabel="Explainable dispatch"
      >
        <Prose>
          <Text>
            Dispatch is the moment the product asks for real trust. Telling a
            dispatcher &ldquo;we&apos;ve assigned Marcus to this job&rdquo; asks
            them to accept a judgment they can&apos;t inspect — and a dispatcher
            who can&apos;t audit a decision will override it every time, which
            means the automation buys nothing.
          </Text>
          <Text>
            So the entire reasoning is on the surface, not in a tooltip. The card
            leads with its own state — <strong>&ldquo;Atom recommends&rdquo;</strong>{' '}
            when it&apos;s awaiting your click,{' '}
            <strong>&ldquo;Auto-assigned&rdquo;</strong> when it already acted —
            then discloses three things: a confidence score stated as a number
            (<em>&ldquo;96% match&rdquo;</em>, not &ldquo;high&rdquo;); the
            ranked runners-up with their scores, so the winner is legible and the
            override is one scored click; and <strong>&ldquo;How Atom
            decided&rdquo;</strong>, the six steps the engine actually walked, each
            rendered only if the backend produced real reasoning for it.
          </Text>
          <Text>
            The technician profile is a <strong>scorecard</strong>, not a contact
            card — first-time-fix rate, SLA compliance, skills rated 1–5,
            certifications, territories — exactly the attributes the engine ranks
            on, so the explanation and its data live in the same vocabulary. The
            dispatcher&apos;s job shifts from <em>making</em> every assignment to{' '}
            <em>auditing</em> them.
          </Text>
        </Prose>
        <ShotPlaceholder
          label='Recommendation card in a ticket — "96% match", ranked "Other matches", and "How Atom decided" expanded into its reasoning steps'
          aspect="16/10"
        />
      </Section>

      <Section
        id="policies"
        label="Rules without a rule builder"
        tocLabel="Dispatch policies"
      >
        <Prose>
          <Text>
            Dispatch policies are genuinely complex — severity thresholds,
            certifications, after-hours behaviour, travel distance, workload,
            cost ceilings. The conventional answer is a visual IF/THEN builder,
            which is miserable and caps expressiveness at its own grammar. The
            opposite — a text box that returns a black box — is easy to write and
            impossible to trust. And this rule decides who gets sent to a gas
            leak.
          </Text>
          <Text>
            So: <strong>write prose → get structure back → simulate before you
            trust it.</strong> You describe the policy in plain language; the AI
            returns not prose but four labelled blocks that mirror how the engine
            executes — <em>when it applies</em>, <em>who&apos;s eligible</em> (a
            hard filter), <em>how they&apos;re ranked</em> (weighted bars summing
            to 100%), and <em>assignment</em>. That split between a hard filter
            and a weighted score is the one thing worth teaching, and the layout
            teaches it without documentation.
          </Text>
          <Text>
            Then a playground: pick a real ticket, run the policy, see the
            technicians it recommends with a <strong>Top match</strong> badge —
            validated against reality before the rule ever touches a live request.
            It&apos;s the piece of thinking from this project I&apos;d most want to
            reuse.
          </Text>
        </Prose>
        <ShotPlaceholder
          label="Policy breakdown — the four labelled blocks with weighted-score bars, plus the simulation playground picking a real ticket"
          aspect="16/10"
        />
      </Section>

      <Section id="tickets" label="Tickets" tocLabel="Tickets">
        <Prose>
          <Text>
            Every request the agents raise — from a call, WhatsApp, email, or the
            web widget — lands in one Tickets queue: one list, one row, one detail
            pane, one set of filters, so there&apos;s a single count of open work
            the whole team can trust.
          </Text>
          <Text>
            The AI summary is the ticket&apos;s headline, credited{' '}
            <em>&ldquo;Summarized by Atom,&rdquo;</em> with the raw conversation
            always one chip away — nobody triages from a five-minute transcript.
            The detail opens as an overlay that slides over the table rather than
            reflowing it, so you can open six tickets in a row without losing your
            place. Attachments stay read-only: they&apos;re the caller&apos;s
            evidence, not yours.
          </Text>
        </Prose>
        <Video
          src="/works/facilio-helpdesk-ai/ticket-module.mp4"
          caption="The Tickets queue and a ticket’s detail overlay — Atom’s summary up top, its recommended technician and the reasoning behind it inside."
        />
      </Section>

      <Section id="contacts" label="Contacts" tocLabel="Contacts">
        <Prose>
          <Text>
            Contacts is the directory behind every conversation — everyone the desk
            has spoken to, searchable by name, email, or phone. A caller who rings
            twice is one record, not two strangers, with their details and activity
            kept together in one place.
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
            Ask AI searches the whole product in plain language and answers with
            the work itself — ask about tickets, technicians, policies, or trends
            and it comes back as the real records, each one a deep-link into the
            right filtered view rather than a paragraph describing them. Every
            conversation is kept in the rail, so you can pick a thread back up
            instead of re-asking.
          </Text>
        </Prose>
        <Video
          src="/works/facilio-helpdesk-ai/ask-ai.mp4"
          caption="Ask AI answering across the whole product — open tickets ranked by urgency, each one a deep-link, with your past chats in the rail."
        />
      </Section>

      <Section
        id="build"
        label="Designing and building the same screen"
        tocLabel="Design + build"
      >
        <Prose>
          <Text>
            Two windows, one screen. On the left, Figma — where I rough out the
            structure and hierarchy and nothing more: what sits next to what,
            roughly how much room each thing needs. On the right, Cursor — where
            that layout becomes the real thing in code, with Claude doing most of
            the typing while I keep the calls on whether it&apos;s right.
          </Text>
          <Text>
            There&apos;s no handoff between the two, because there&apos;s nobody to
            hand off to — and that turns out to be the point. The decisions I care
            most about here only survive when the same person designs and builds:
            how a screen moves and how fast it <em>feels</em> — an optimistic jump
            into a drafting state, a response that streams without shoving the page
            around. A static frame can only show those at rest, which is the least
            interesting moment. So I build what I design, and judge it running.
          </Text>
        </Prose>
        <DesignBuildShowcase />
      </Section>

      <Section id="voice" label="Voice and tone as a system" tocLabel="Voice & tone">
        <Prose>
          <Text>
            I wrote the copy and treated it as part of the interface. Four rules
            did real work. <strong>Never name the state — name what to do about
            it:</strong> a busy phone number reads{' '}
            <em>&ldquo;In use by &lsquo;Front Desk Agent&rsquo;. Remove it from
            there to use it here,&rdquo;</em> not &ldquo;Occupied.&rdquo;{' '}
            <strong>Empty states teach the model:</strong>{' '}
            <em>&ldquo;Your workforce lives in the tools you already use — set up
            a data source and your technicians sync in here.&rdquo;</em>
          </Text>
          <Text>
            <strong>Borrow the user&apos;s vocabulary per channel:</strong> a call
            has a &ldquo;Duration&rdquo;; an email thread was &ldquo;Closed
            in&rdquo; three days. And <strong>ban the wrong noun outright</strong>{' '}
            — the people calling a facilities desk are occupants and requesters,
            never &ldquo;customers.&rdquo; Every rule has a reason attached, which
            is what makes it usable by someone else.
          </Text>
        </Prose>
        <Callout>
          A style guide full of adjectives — &ldquo;friendly, clear,
          human&rdquo; — isn&apos;t usable by anyone else. A rule with a reason
          attached is.
        </Callout>
      </Section>

      <Section
        id="how-i-worked"
        label="How I actually worked"
        tocLabel="How I worked"
      >
        <Prose>
          <Text>
            I&apos;m a product designer. I didn&apos;t become an engineer — I
            stopped needing one to find out whether an idea was any good. The loop
            is <strong>rough layout in Figma → build the real thing in code with
            AI → judge it running.</strong> Figma is where the thinking happens
            now, not where the design is finished: structure, hierarchy, what sits
            next to what. I stopped producing pixel specs, because a spec exists to
            transfer a design to someone else and there was nobody to transfer it
            to.
          </Text>
          <Text>
            The real work happens in the browser — not a preference, a requirement
            of what this product is: <strong>almost everything hard here
            moves.</strong> A voice agent answering a call, tokens streaming into a
            scroll container, a fifteen-second crawl that has to hold attention, a
            card expanding into six reasoning steps. A static frame only tells you
            what those look like at rest, which is the least important moment. The
            judgments I&apos;m proudest of here — anchoring the prompt instead of
            chasing the scroll, navigating optimistically into a drafting state —
            are ones I could only make with the thing running in front of me.
          </Text>
          <Text>
            <strong>AI writes most of the code</strong> — implementation velocity,
            the parts of frontend that are knowledge rather than judgment. It
            removed the tax that used to make a designer&apos;s idea &ldquo;too
            expensive to try.&rdquo; What I keep is the problem framing, the
            information architecture, the interaction model, the copy, and the call
            on whether the result is actually right. Ask AI to build a dispatch
            policy editor and you get a rule builder with condition rows —
            competent, conventional, and the wrong answer.
          </Text>
          <Text>
            So the risk is specific: <strong>AI is fastest at producing the
            average version of any interface.</strong> It has read every settings
            page ever written and will happily hand you one, which makes resisting
            the generic default a real part of the job. It held up because the
            product is live with facilities teams and I could act on real feedback
            the same day I heard it — not lab studies, but the shortest distance
            from &ldquo;this confuses people&rdquo; to a fix in production I&apos;ve
            had in my career.
          </Text>
        </Prose>
        <Callout>
          The sections above are written as decisions rather than descriptions on
          purpose: the decision is the part that was mine; the code is the part
          that got cheap. The constraint moved from <em>can I get this built</em>{' '}
          to <em>do I know what&apos;s right</em> — which is harder, and is also
          the actual job.
        </Callout>
      </Section>

      <Section
        id="close"
        label="What I'd take to the next thing"
        tocLabel="Reflection"
        className="lg:mt-40"
      >
        <Prose>
          <Text>
            <strong>Explainability is an interface problem, not a model
            problem.</strong> The score, the runners-up, and the reasoning steps
            were design decisions — and auditable is the only version of AI
            automation that gets adopted.
          </Text>
          <Text>
            <strong>Prose in → structure out → simulate</strong> is the most
            reusable pattern here: natural language for input, structured
            rendering so the interpretation is inspectable, a sandbox to verify
            before it&apos;s live. <strong>Draft, don&apos;t demand</strong> —
            reduce first-run setup to correcting a good guess. And{' '}
            <strong>perceived speed is design material</strong>, the one that most
            needs the designer&apos;s hands on the code.
          </Text>
        </Prose>
      </Section>
    </>
  )
}
