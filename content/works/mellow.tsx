import {
  Text,
  Section,
  Prose,
  Callout,
} from '@/components/works/body'
import { SceneShot } from '@/components/works/SceneShot'

export default function Body() {
  return (
    <>
      <Section id="problem" label="The problem" tocLabel="The problem">
        <Prose>
          <Text>
            Teams live in a chat app and a task tracker at once. Context leaks
            through the seam — links pasted back and forth, status duplicated,
            decisions buried in a DM.
          </Text>
          <Text>
            The brief: collapse both into one surface, with neither feeling
            bolted on.
          </Text>
        </Prose>
      </Section>

      <Section id="approach" label="Three principles" tocLabel="Approach">
        <Prose>
          <Text>
            <strong>One surface, shared primitives.</strong> Any message can
            become a task; any task keeps the thread that made it.
          </Text>
          <Text>
            <strong>AI as triage, not a chatbot.</strong> It surfaces the few
            things that need you and stays quiet otherwise.
          </Text>
          <Text>
            <strong>Calm by default.</strong> Light surface, one accent, so
            real signal reads as signal.
          </Text>
        </Prose>
      </Section>

      <Section id="onboarding" label="Getting in" tocLabel="Getting in">
        <Prose>
          <Text>
            One decision per screen: sign in, verify a code, set up a profile —
            with a live preview of the app alongside so the payoff is visible
            before you commit.
          </Text>
          <Text>
            Org setup then seeds sensible defaults, and the last step invites
            the team with roles set up front.
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
            your mentions — not an unread-count firehose. Every card opens
            straight into its thread.
          </Text>
          <Text>
            My Tasks filters the same data down to just you, grouped by status
            — so the morning starts with a plan, not a backlog.
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
            One tap away, and it starts from prompts drawn from your actual
            work — pending tasks, deadlines, unresolved threads.
          </Text>
          <Text>
            Answers are grounded in your tasks and conversations, and every
            chat is kept in Recents to pick up later.
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
            organised into Topics instead of one endless channel. Each topic
            carries a Discussions tab and a Tasks tab side by side.
          </Text>
          <Text>
            Creating a workspace and managing its people share one lightweight
            modal — name, description, add people. No wizard.
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
            But because a topic is a container, this is also where a message
            becomes a task, and a long thread condenses into an AI summary.
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
            Tasks live in the same topic as the conversation that spawned them,
            as a grouped List or a Kanban board. One shared control row — Group
            By and Show Completed — so switching views never means relearning.
          </Text>
        </Prose>
        <Callout>
          Every task card reads the same everywhere — home, list, board, or
          thread. That single anatomy is what makes &ldquo;one surface&rdquo;
          feel like one surface.
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
            DMs reuse the topic primitives — a message can still become a
            task. Link previews unfurl, files render as inline cards, and the
            empty state names who you&apos;re about to talk to.
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
            The promise that chat and tasks are one thing only holds if the
            shared pieces are genuinely shared: one card anatomy, one set of
            controls, one way a message turns into work.
          </Text>
          <Text>
            Shipping solo across 40+ screens, that system was the guardrail —
            tokens, states, and reused primitives doing the work a larger team
            would spread across reviews.
          </Text>
        </Prose>
      </Section>
    </>
  )
}
