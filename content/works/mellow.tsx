import {
  Text,
  Section,
  Prose,
  Points,
  Point,
  Callout,
} from '@/components/works/body'
import { SceneShot } from '@/components/works/SceneShot'

export default function Body() {
  return (
    <>
      <Section id="problem" label="The problem" tocLabel="The problem">
        <Prose>
          <Text>
            Teams live in a chat app and a task tracker at once, and context
            leaks through the seam — links pasted back and forth, decisions
            buried in a DM.
          </Text>
          <Text>
            <strong>The brief:</strong> one surface, with neither half feeling
            bolted on.
          </Text>
        </Prose>
      </Section>

      <Section id="approach" label="Three principles" tocLabel="Approach">
        <Prose>
          <Points numbered>
            <Point lead="One surface, shared primitives.">
              Any message can become a task; any task keeps the thread that
              made it.
            </Point>
            <Point lead="AI as triage, not a chatbot.">
              It surfaces the few things that need you and stays quiet
              otherwise.
            </Point>
            <Point lead="Calm by default.">
              Light surface, one accent, so real signal reads as signal.
            </Point>
          </Points>
        </Prose>
      </Section>

      <Section id="onboarding" label="Getting in" tocLabel="Getting in">
        <Prose>
          <Text>
            One decision per screen — sign in, verify, set up a profile — with
            a live preview alongside so the payoff shows before you commit. Org
            setup seeds defaults; the last step invites the team with roles.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/onboarding.jpg"
          alt="Get Started with Mellow — sign-up screen beside a preview of the live product"
          priority
        />
        <SceneShot
          src="/works/mellow/verify-code.jpg"
          alt="Check your inbox — six-box email verification code entry with a resend link"
        />
        <SceneShot
          src="/works/mellow/profile-setup.jpg"
          alt="Set Up Your Profile — name, avatar, and password with inline validation"
        />
        <SceneShot
          src="/works/mellow/org-setup.jpg"
          alt="Set up your organization — name, size, role, and work type with a step progress bar"
        />
        <SceneShot
          src="/works/mellow/invite-people.jpg"
          alt="Invite people — add by email or link, each with a Member or Admin role"
        />
      </Section>

      <Section id="home" label="The Attention Hub" tocLabel="Attention Hub">
        <Prose>
          <Text>
            Home opens on what the assistant judged worth your attention, plus
            your mentions — not an unread-count firehose. My Tasks filters the
            same data down to just you, grouped by status.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/home-attention.jpg"
          alt="Home Attention Hub — Important tab of assistant-curated activity"
        />
        <SceneShot
          src="/works/mellow/home-mentions.jpg"
          alt="Home Attention Hub, Mentions tab — messages where you were @-mentioned"
        />
        <SceneShot
          src="/works/mellow/home-tasks.jpg"
          alt="Home My Tasks — assigned work grouped by status with priority and due dates"
        />
      </Section>

      <Section id="ai" label="Mellow AI" tocLabel="Mellow AI">
        <Prose>
          <Text>
            One tap away, starting from prompts drawn from your actual work —
            pending tasks, deadlines, unresolved threads. Answers are grounded
            in your data, and every chat stays in Recents.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/ai-ask.jpg"
          alt="Ask Mellow AI — assistant panel with context-aware suggested prompts"
        />
        <SceneShot
          src="/works/mellow/ai-chat.jpg"
          alt="Mellow AI answering a question about pending tasks and deadlines"
        />
        <SceneShot
          src="/works/mellow/ai-recents.jpg"
          alt="Mellow AI with the Recents list of past conversations open"
        />
      </Section>

      <Section id="workspaces" label="Workspaces & Topics" tocLabel="Workspaces">
        <Prose>
          <Text>
            A workspace is a team&apos;s space; inside it, conversation is
            organised into Topics, each with Discussions and Tasks side by
            side. Creating one is a single modal — no wizard.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/topics.jpg"
          alt="Workspace Topics list — active topics with last message and mention counts"
        />
        <SceneShot
          src="/works/mellow/create-workspace.jpg"
          alt="Create Workspace modal — space name, description, and add-people search"
        />
        <SceneShot
          src="/works/mellow/topics-manage-people.jpg"
          alt="Manage People modal — searchable member list with per-person remove controls"
        />
      </Section>

      <Section id="discussions" label="Discussions" tocLabel="Discussions">
        <Prose>
          <Text>
            Full messaging — mentions, quoted replies, reactions, attachments.
            Because a topic is a container, a message here becomes a task, and
            a long thread condenses into an AI summary.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/discussions.jpg"
          alt="Topic discussion thread — mentions, a quoted reply, PDF attachments, and the composer"
        />
        <SceneShot
          src="/works/mellow/discussions-emoji.jpg"
          alt="A discussion thread with the emoji picker open over a message with reactions"
        />
        <SceneShot
          src="/works/mellow/discussions-ai-summary.jpg"
          alt="A discussion thread with a Summarise action and a per-message Resolve control"
        />
      </Section>

      <Section id="tasks" label="Tasks" tocLabel="Tasks">
        <Prose>
          <Text>
            Tasks live in the topic that spawned them, as a List or a Kanban
            board, with one shared control row so switching views never means
            relearning.
          </Text>
        </Prose>
        <Callout>
          Every task card reads the same everywhere — home, list, board,
          thread. One anatomy is what makes one surface feel like one surface.
        </Callout>
        <SceneShot
          src="/works/mellow/tasks-list.jpg"
          alt="Task list grouped by status, with assignee, priority, due date, and topic"
        />
        <SceneShot
          src="/works/mellow/tasks-by-assignee.jpg"
          alt="The same task list re-grouped by assignee, with a Show Completed toggle"
        />
        <SceneShot
          src="/works/mellow/tasks-kanban.jpg"
          alt="Kanban board — To do, In Progress, and Completed columns with task cards"
        />
        <SceneShot
          src="/works/mellow/tasks-dragging.jpg"
          alt="Kanban board mid-drag — a card lifted between columns with a drop placeholder"
        />
      </Section>

      <Section id="dm" label="Direct messages" tocLabel="Direct messages">
        <Prose>
          <Text>
            DMs reuse the topic primitives — a message can still become a task.
            Links unfurl, files render inline, and the empty state names who
            you&apos;re about to talk to.
          </Text>
        </Prose>
        <SceneShot
          src="/works/mellow/dm.jpg"
          alt="Direct message inbox — conversations with delivery ticks beside an open thread"
        />
        <SceneShot
          src="/works/mellow/dm-empty.jpg"
          alt="An empty direct-message thread that names the person you're about to message"
        />
        <SceneShot
          src="/works/mellow/dm-attachment.jpg"
          alt="Direct message with an inline PDF and image attachment preview"
        />
        <SceneShot
          src="/works/mellow/dm-reply.jpg"
          alt="A direct-message thread with a quoted reply, an unfurled Figma link, and a reaction"
        />
      </Section>

      <Section id="close" label="What held it together" tocLabel="Reflection" className="lg:mt-40">
        <Prose>
          <Text>
            Chat and tasks are one thing only if the shared pieces are
            genuinely shared: one card anatomy, one control row, one way a
            message turns into work. Solo across 40+ screens, that system was
            the guardrail.
          </Text>
        </Prose>
      </Section>
    </>
  )
}
