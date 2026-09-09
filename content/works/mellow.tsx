import {
  Text,
  Section,
  Prose,
  Heading,
  Callout,
} from '@/components/works/body'
import { SceneShot } from '@/components/works/SceneShot'

export default function Body() {
  return (
    <>
      <Section id="problem" label="The problem" tocLabel="The problem">
        <Prose>
          <Text>
            Teams live in two tools at once — a chat app and a task tracker —
            and context leaks out of the seam: links pasted back and forth,
            status duplicated, decisions buried in a DM.
          </Text>
          <Text>
            The brief: collapse the two into one surface, without either the
            chat or the tasks feeling bolted on.
          </Text>
        </Prose>
      </Section>

      <Section id="approach" label="Approach" tocLabel="Approach">
        <Prose>
          <Heading>Three principles</Heading>
          <Text>
            <strong>One surface, shared primitives.</strong> A message and a
            task are the same object from two angles — any message can become a
            task; any task keeps the thread that made it.
          </Text>
          <Text>
            <strong>AI as triage, not a chatbot.</strong> The assistant
            doesn&apos;t wait to be asked — it surfaces the few things that need
            you and stays quiet otherwise.
          </Text>
          <Text>
            <strong>Calm by default.</strong> Light surface, generous
            whitespace, one accent, restraint with colour — so real signal reads
            as signal.
          </Text>
        </Prose>
      </Section>

      <Section id="onboarding" label="Getting in" tocLabel="Getting in">
        <Prose>
          <Text>
            Onboarding splits in two. A single-purpose auth screen gets you
            through the door — Google or email, nothing else on the page — while
            a preview of the live app sits alongside so the payoff is visible
            before you commit.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/onboarding.jpg"
          alt="Get Started with Mellow — sign-up screen beside a preview of the live product"
          priority
        />
        <Prose>
          <Text>
            The rest of sign-up keeps to one decision per screen: confirm a
            code sent to your inbox, then set a name, photo, and password —
            with inline validation (&ldquo;that&apos;s great, your password
            meets the requirements&rdquo;) so you never submit and bounce.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/verify-code.jpg"
          alt="Check your inbox — a six-box email verification code entry with a resend link and a verify button, the live app previewed alongside"
        />
        <SceneShot
          src="/works/mellow/profile-setup.jpg"
          alt="Set Up Your Profile — a name field, an avatar upload, and a secure-password field showing a met-requirements hint, beside a preview of the app"
        />
        <Prose>
          <Text>
            Once you&apos;re in, setup does the heavier lifting: a short,
            progress-tracked flow to name the organisation, size it, and capture
            role and function. Those answers seed sensible defaults — which
            workspaces to suggest, who to invite — so the first real screen
            already feels populated rather than empty.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/org-setup.jpg"
          alt="Set up your organization — org name, size, role, and work-type selection with a step progress bar"
        />
        <Prose>
          <Text>
            The last step turns setup into a team: invite people by email or a
            shareable link, each added with a Member or Admin role up front —
            or skip it and come back once the workspace is live.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/invite-people.jpg"
          alt="Invite people to the workspace — an add-email field with a copy-invite-link option and a list of added teammates, each with a Member or Admin role"
        />
      </Section>

      <Section id="home" label="The Attention Hub" tocLabel="Attention Hub">
        <Prose>
          <Text>
            Home is the assistant&apos;s work made visible. Instead of an
            unread-count firehose, it opens on an Attention Hub: Important —
            what the assistant judged worth surfacing — and Mentions, where
            you&apos;ve been pulled in by name. Every card carries its source
            (workspace / topic) and opens straight into the originating thread.
          </Text>
          <Text>
            A second tab, My Tasks, groups everything assigned to you by status
            — To do, In Progress — with priority and due date inline. It&apos;s
            the same data the workspaces hold, filtered down to just you, so the
            first thing you see each morning is a plan rather than a backlog.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/home-attention.jpg"
          alt="Home Attention Hub — Important and Mentions tabs of assistant-curated activity"
        />
        <SceneShot
          src="/works/mellow/home-mentions.jpg"
          alt="Home Attention Hub, Mentions tab — messages where you were @-mentioned by name, each tagged with its workspace and topic"
        />
        <SceneShot
          src="/works/mellow/home-tasks.jpg"
          alt="Home My Tasks — assigned work grouped by status with priority and due dates"
        />
      </Section>

      <Section id="ai" label="Mellow AI" tocLabel="Mellow AI">
        <Prose>
          <Text>
            The assistant is one tap away — Ask Mellow AI opens over whatever
            you&apos;re on and starts from prompts drawn from your actual work:
            pending tasks, upcoming deadlines, who&apos;s on a campaign,
            unresolved threads.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/ai-ask.jpg"
          alt="Ask Mellow AI — assistant panel with context-aware suggested prompts"
        />
        <Prose>
          <Text>
            Ask in plain language and it answers with grounded context — reading
            across your tasks, threads, and deadlines instead of guessing. Every
            conversation is kept in Recents so you can pick a thread back up.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/ai-chat.jpg"
          alt="Mellow AI answering a question about pending tasks and deadlines"
        />
        <SceneShot
          src="/works/mellow/ai-recents.jpg"
          alt="Mellow AI with the Recents list open — past conversations like Color Theory Deep Dive, UX Ideations, and Pending tasks for today, ready to reopen"
        />
      </Section>

      <Section id="workspaces" label="Workspaces & Topics" tocLabel="Workspaces">
        <Prose>
          <Text>
            A workspace is a team&apos;s shared space. The left rail lists them —
            dev_discuss, marketing, design_dialogue, and so on — with pinned
            workspaces floated to the top and small markers for mentions and
            important activity, so the rail itself is a glanceable status board.
          </Text>
          <Text>
            Inside each workspace, conversation is organised into Topics rather
            than one endless channel. A topic can be Active or Closed, shows its
            last message and unread markers, and carries both a Discussions tab
            and a Tasks tab — the two halves of the same subject living side by
            side.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/topics.jpg"
          alt="Workspace Topics list — active topics with last message, mention and important counts"
        />
        <Prose>
          <Text>
            Creating a workspace is deliberately light: a name, an optional
            description, and people added inline from search — all in a single
            modal, no multi-step wizard. Editing and deleting flow through the
            same panel.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/create-workspace.jpg"
          alt="Create Workspace modal — space name, description, and add-people search"
        />
        <Prose>
          <Text>
            Membership stays editable after the fact: a Manage People panel
            searches the directory, shows everyone currently in the space, and
            adds or removes them one click at a time — the same lightweight
            model as creating the workspace, reused rather than reinvented.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/topics-manage-people.jpg"
          alt="Manage People modal over a workspace — a searchable people list with per-person remove controls and the current member count"
        />
      </Section>

      <Section id="discussions" label="Discussions" tocLabel="Discussions">
        <Prose>
          <Text>
            Discussions carry the full messaging model you&apos;d expect —
            @mentions, threaded replies, emoji reactions, and a rich composer
            with inline formatting and file attachments. Replies quote the
            message they answer, so a long thread stays legible instead of
            fragmenting.
          </Text>
          <Text>
            Because a topic is a container and not just a chat, this is also
            where a message becomes work: any message can be promoted to a task
            in the topic&apos;s Tasks tab, and long threads condense into an AI
            summary with linked sources — so stepping away for a day
            doesn&apos;t mean scrolling back through all of it.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/discussions.jpg"
          alt="Topic discussion thread — mentions, a quoted reply, PDF attachments, and the rich composer"
        />
        <SceneShot
          src="/works/mellow/discussions-emoji.jpg"
          alt="A discussion thread with the full emoji picker open — search, frequently used, and categories — over a message carrying a PDF attachment and reactions"
        />
        <SceneShot
          src="/works/mellow/discussions-ai-summary.jpg"
          alt="A topic discussion thread with @mentions, a Summarise action in the corner, and a per-message Resolve control"
        />
      </Section>

      <Section id="tasks" label="Tasks" tocLabel="Tasks">
        <Prose>
          <Text>
            Tasks live inside the same topic as the conversation that spawned
            them, viewable as a grouped List or a Kanban board. Both share one
            control row — Group By (Status, Priority, Assignee, Due Date) and a
            Show Completed toggle — so switching views never means relearning
            the surface.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/tasks-list.jpg"
          alt="Task list grouped by status, with assignee, priority, due date, and originating topic"
        />
        <SceneShot
          src="/works/mellow/tasks-by-assignee.jpg"
          alt="The same task list re-grouped by the Group By control, with a Show Completed toggle — every row keeps its assignee, priority, due date, and originating topic"
        />
        <Prose>
          <Text>
            The Kanban board columns by status with live counts, and every card
            keeps the same anatomy as its list row — assignee, priority dot, due
            date, and the topic tag that links it back to its conversation. Drag
            states, hover, and empty columns were all drawn so the board holds
            up whether a team has three tasks or thirty.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/tasks-kanban.jpg"
          alt="Kanban board — To do, In Progress, and Completed columns with task cards"
        />
        <SceneShot
          src="/works/mellow/tasks-dragging.jpg"
          alt="The Kanban board mid-drag — a task card lifted between the To do and In Progress columns with a drop placeholder, live per-column counts above"
        />
        <Callout>
          Every task and message card reads the same everywhere it appears —
          home, list, board, or thread. That single anatomy is what lets the
          &ldquo;one surface&rdquo; idea actually feel like one surface.
        </Callout>
      </Section>

      <Section id="dm" label="Direct messages" tocLabel="Direct messages">
        <Prose>
          <Text>
            DMs share the same primitives as topics — a message can still become
            a task, and read receipts, typing, and delivery states are handled
            end to end. The composer surfaces attach, emoji, and send in one row
            rather than hiding them behind a plus button.
          </Text>
          <Text>
            Attachments get real treatment: link previews unfurl, PDFs and
            images render as inline cards with hover affordances to open or
            download, and the empty state names who you&apos;re about to talk to
            instead of showing a blank canvas.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/dm.jpg"
          alt="Direct message inbox — a list of conversations with delivery ticks and timestamps beside a freshly opened thread"
        />
        <SceneShot
          src="/works/mellow/dm-empty.jpg"
          alt="An empty direct-message thread that names the person you're about to message — send a private message to start this convo"
        />
        <SceneShot
          src="/works/mellow/dm-attachment.jpg"
          alt="Direct message with an inline PDF and image attachment preview"
        />
        <SceneShot
          src="/works/mellow/dm-reply.jpg"
          alt="A direct-message thread with a quoted reply, an unfurled Figma link, an inline document attachment, and an emoji reaction"
        />
      </Section>

      <Section id="close" label="Reflection" tocLabel="Reflection" className="lg:mt-40">
        <Prose>
          <Text>
            The hardest part wasn&apos;t any single screen — it was keeping the
            promise that chat and tasks are one thing. That only holds if the
            shared pieces are genuinely shared: one card anatomy, one set of
            group-by controls, one way a message turns into work, repeated
            everywhere. Get that right and the AI has a clean model to reason
            over; get it wrong and you&apos;re back to two tools wearing one
            skin.
          </Text>
          <Text>
            Shipping it solo meant the system had to be its own guardrail —
            tokens, states, and reused primitives doing the work a larger team
            would spread across specs and reviews.
          </Text>
        </Prose>
      </Section>
    </>
  )
}
