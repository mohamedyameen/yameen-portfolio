# Recording guide — Facilio Helpdesk & Dispatcher Agent

Thirteen clips fill the `ShotPlaceholder` slots in
`content/works/facilio-helpdesk-ai.tsx` and `content/works/facilio-dispatcher-agent.tsx`.
Each slot's `label` is its brief; this file is the click-by-click version.

**Every screen and control named below was read off the running demo.** Nothing
here is from the source or from memory — if a control isn't listed, it isn't on
that screen.

**Before you start**

1. Run `npm run dev` from your own terminal. Everything below is recorded from
   the self-hosted demo at `http://localhost:3000`, not from the real console.
2. Record the browser at **1600×1000** — the size `DemoFrame` lays the console out
   at, so the clip and the embedded demo match.
3. Drop each finished file into `public/works/facilio-helpdesk-ai/`, then swap the
   `<ShotPlaceholder>` for a `<Video src=… caption=… />` at the same spot.

## Keep every clip short

`Video` renders **autoplaying, muted and looping**. That decides the format:

- **8–15 seconds each.** A clip that loops every ten seconds reads as a moving
  screenshot. A ninety-second walkthrough on loop is just noise — and nobody
  watches to the end anyway.
- **One idea per clip.** If a beat needs a sentence of setup, it's two clips.
- **No audio, no cursor hunting.** Move deliberately; land on the control, don't
  search for it. Dead time is most of what makes a clip feel long.
- **Start and end on a similar frame** so the loop doesn't jump.

**Splitting is the default, not a fallback.** A `ShotPlaceholder` isn't one video —
it's a slot in the media column, and the column stacks. Replace one placeholder
with two or three short `<Video>` elements and they read as a sequence:

```tsx
<Video src="/works/facilio-helpdesk-ai/intake-greeting.mp4" caption="Each tone is a prompt — the hover-card shows which." />
<Video src="/works/facilio-helpdesk-ai/intake-scope.mp4" caption="Scope of Work: the agent's rules, in plain English." />
```

So don't plan a take that covers a whole screen. Under each clip below, **The shot**
is the ten seconds worth recording; everything after it is a menu of extra clips to
cut from the same session if you want the section to breathe.

---

## Helpdesk — 7 clips

### 1. Onboarding, end to end · `facilio-helpdesk-ai.tsx:100`

**The shot (~12 s):** URL typed → crawl lines running → "Here's What We Found"
appears filled in. That's the whole argument — a website in, a configured agent out.
The modal and the phone step are separate clips.

`/helpdesk/onboarding?demo=onboarding` — the flag boots a fresh un-onboarded trial
account. The flow runs on timers, so wait rather than clicking through the pauses.
Record the full run once, then cut three clips out of it: **the crawl**, **the
filled-in result**, and **the ready modal**.

1. Landing: **"Your Facilities, on Autopilot. Finally."** — *"Drop your website —
   we'll do the rest"*, with **Get Started** and a **No website?** link.
2. Type a URL → submit. Crawl status lines animate for ~8 s. Let them play.
3. "Here's What We Found" with pre-filled chips. **Edit one chip** so it's visibly yours.
4. **Looks Good** → "creating" for ~6 s → lands in the product.
5. Keep rolling: the **"Your Helpdesk Is Ready!"** modal auto-opens on Home.

*Ends where clip 2 begins — record 1 and 2 as one take and cut.*

### 2. Get Started → phone verification · `:119`

**The shot (~10 s):** the OTP typed → **Verify & call me** → the calling state.
Cut before the WhatsApp QR and make that a second clip if you want it.

Continue from clip 1.

1. **"Your Helpdesk Is Ready!"** modal → **Verify Your Phone Number**.
2. Any number → **Send Verification Code**.
3. Any 6 digits → **Verify & call me**. Both POSTs pass on anything.
4. The calling state plays, then the success screen with the **WhatsApp QR**.

⚠️ No phone actually rings. End on the calling state, or film your phone separately.

### 3. Intake agent — General, then the channel tabs · `:140`

**The shot (~10 s):** the hover glide along the **Greeting** chips, two or three
cards deep. Nothing else on this tab earns a clip as well.

This screen is long, so treat it as a source for **three short clips**, not one
scroll: ① the Greeting/Behaviour hover glide · ② Scope of Work · ③ one channel tab.

`/helpdesk/intake`. The tab row reads **General · Calls · Whatsapp · Web Widget ·
Email**, with **Save And Publish** top right. A **Playground** panel sits on the
right of every tab.

**General**, in the order it scrolls:

1. **Identity** — *"How the agent sounds when interacting with users."* Agent Name,
   Language (English), Dialect (British (UK)).
2. **Voice** — Female / Male toggle, then three cards: **Amelia** *warm*,
   **Beatrice** *measured*, **Imogen** *bright* — each with a one-line description
   of how it sounds. Switch the selection between them.

   ⚠️ Each card shows a **play button**, but it produces **no sound in the demo** —
   it fetches `/api/assistant/channel/voices/stream/…`, which the mock doesn't
   serve. Don't press it on camera; it looks broken. Selecting a card is the beat.
3. **Greeting** — a chip row: Enthusiastic · Neutral · Professional · Direct ·
   Empathetic · Calm · Crisp. (Professional is selected by default.)
4. **Behaviour** — Professional & Empathetic · Friendly & Casual · Formal & Precise ·
   Calm & Reassuring · Assertive & Efficient.

   **⭐ Hover each chip before you click it.** Every Greeting and Behaviour chip
   carries a hover-card with the full prompt text it maps to — hovering
   *Enthusiastic* pops **"Open with energy — greet the caller warmly, sound pleased
   to help, and invite them to describe the problem."** The label is the shorthand;
   the card is what the agent is actually told.

   Shoot it as a slow glide along the row — pause ~1 s on each chip so the card has
   time to appear and be read, then click one to change the selection. Two or three
   chips per row is enough; don't walk all seven. The same hover-card is on the
   **Closing message** presets further down (With Ticket ID · Simple Goodbye ·
   Email confirmation · Dispatch notice), so you can repeat the move there.

   This is the beat that makes the section's argument — a picker of tones is really
   a picker of prompts, and the hover-card is where the design admits it.
5. **File Analysis** — *"reads images and PDFs shared during a conversation."*
6. **Scope of Work** with **Explore Library** — five written rules: "Answer from
   documentation only", "Confirm tower and floor", "No third-party ETAs",
   "Escalate safety immediately", "Link repeat reports". **This is the best beat on
   the tab** — it's the agent's policy in plain English.
7. **Conversation end condition** → **Closing message** presets: With Ticket ID ·
   Simple Goodbye · Email confirmation · Dispatch notice · **Write my own**.
8. **Actions** — *"Include actions for your agent like using external tools"* →
   **Add Action**.

Then the channel tabs, which are short — one beat each:

- **Calls** — *"Choose which phone numbers handle this intake."* Three UK numbers:
  Main reception line `+44 20 7946 0102` (**Purchased**), Out-of-hours emergency
  `+44 20 7946 0187`, Manchester campus `+44 161 496 0044`. Below them **"Need A
  New Number?"** → **Buy Number**.
- **Whatsapp** — **WhatsApp Numbers**, Northgate tenants `+44 7700 900812`
  (Purchased). The Playground turns into a chat preview with Ava's greeting.
- **Web Widget** — **Widgets** → **New Widget**, two widgets (*Tenant portal* —
  "Ask the Northgate helpdesk"; *Public website* — "Questions about the building?"),
  each with **Embed Code**. Playground offers **Start a Call** / **Start a Chat**.
- **Email** — **Email Accounts**, Tenant support inbox with Incoming / Outgoing
  `support@northgate.example`.

> There is **no call transfer** anywhere on this page. The Calls tab is phone
> numbers and a Buy Number card, nothing else.

### 4. Add Scenario · `:144`

**The shot (~12 s):** type the gas-smell trigger → the response → **Add** → it
lands in the list. Start with the Scenarios section already on screen; don't film
the scroll to reach it.

`/helpdesk/intake`, **General** tab. Scroll past Scope of Work to **Scenarios** —
*"Q&A pairs that guide the agent's responses to real-world requests."* Four pairs
are already there ("A tenant reports no heating", "Someone asks for an access card",
"A caller reports a person trapped in a lift", "A tenant asks about the service
charge"), each with an **Agent Response**.

1. **Add** — the one inside the Scenarios section, not the page's other Add buttons.
2. Trigger: *"There's a strong smell of gas near the basement parking"*.
3. Agent Response: the wording you want back.
4. **Add** → it lands in the list beside the other four.
5. **Save And Publish**.

### 5. The Playground — ❌ real product only

A live call over a WebSocket to the voice stack. Nothing to mock, and a faked
transcript would be dishonest. Record it on the real console, or drop the slot and
let clip 4 carry the section.

The **Playground** panel *is* on screen in the demo (phone mock, channel toggles,
a call button) — so if you only need it as scenery, clip 3 already shows it.

### 6. Inbox → Calls · `:182`

**The shot (~10 s):** open a call and let the eye land on **Analyzed by Atom** →
tone → **Summary**. The transcript scroll is a good second clip on its own.

`/helpdesk/inbox/call-logs`. The conversation list runs down the left — Owen
Castellano 4h, Grace Mbeki 1h, Farah Haddad, Callum Findlay 3h, Ines Ferreira 8h,
Gareth Powell 22h, Hannah Doyle 1d — each with its last agent line as a preview.

Open one and the detail pane shows, top to bottom:

1. The caller's number and a **Download call** button.
2. **Analyzed by Atom** → the detected tone (*Concerned* — "The caller is unsure or
   worried about the issue").
3. **Summary** — "Caller reported lift 3 juddering between levels 6 and 4. No
   entrapment. Escalated to Kone under contract."
4. The transcript, timestamped and speaker-labelled, from **Call started** to
   **Call ended**, ending with **Duration 3m 6s**.

⚠️ **No audio.** There is a **Download call** button but the fixtures carry no
audio file, so nothing plays. Don't plan a "press play" beat — the transcript and
the Atom summary are the story.

⚠️ **No translation bar and no Arabic transcript.** Every fixture is English. The
Arabic "Khawalid" material is an existing recording in `~/Desktop/Helpdesk-demovideos/`;
lift the beat from there or cut it.

### 7. Feedback & CSAT · `:244`

**The shot (~10 s):** the **Opening message** with `{requester}` `{issue}` `{site}`
and the "variables resolve at send time" note. It's the one screen here that says
something a screenshot can't.

Good second clip: the **When / Then** escalation builder. Skip the trigger cards —
they photograph fine as a still.

`/helpdesk/feedback`. Nav-parked in the product but renders fully by direct URL.
**It is one continuous page — there are no tabs.** The full contents:

1. **Survey triggers** — Ticket marked resolved · Work order closed · Service
   request completed, each with its own one-line explanation.
2. **Wait after resolution before sending** — Immediately · 15 min · 30 min ·
   1 hour · 2 hours. Then **Send one reminder** ("Re-send after 24 h if no
   response, then stop").
3. **Survey template** — 1–5 CSAT · 0–10 NPS · CES effort.
4. **Opening message** with live variables — *"Hi {requester}, your {issue} at
   {site} has been marked as resolved…"* and the note *"Variables resolve at send
   time"*. A good beat for the "words as interface" section.
5. **Conditional follow-up questions** — High 4–5 / Medium 3 / Low 1–2, each with
   a different question.
6. **Escalation rules** — the **When** / **Then** builder: "The survey score is"
   ≤ 1 / ≤ 2 / ≤ 3, "…or the issue is left unresolved", then "Do these
   automatically".
7. **Save And Publish**.

> **Cut the "drag-reorder channel priority" beat** — there is no Channels tab on
> this page.

---

## Dispatcher Agent — 6 clips

### 1. Write a policy from a prompt · `facilio-dispatcher-agent.tsx:93`

**The shot (~15 s):** prompt typed → **Enter** → the structured policy resolves on
the right. This is the single most important clip in either case study — a sentence
of English becoming triggers, filters and a weighting. Give it the extra seconds.

The refine step is a **separate clip**: follow-up typed → the weighting bar visibly
shifts. Don't glue them together.

`/dispatcher-agent/dispatch/policies`. The canvas reads **Available Dispatch
Policies (4)** with the four cards, and above them **Plain Language** — *"Describe
how tickets should match technicians, and Facilio Atom drafts the policy for you."*
— a textarea placeholdered *"Describe your dispatch policy…"* and a **Try an
example** row.

1. Click the textarea (or an example chip).
2. Type: *"Any emergency electrical fault in a stairwell goes to a certified
   electrician who can be on site within 30 minutes."*
3. **Enter** → the builder drafts and navigates to the new policy. Chat reply on the
   left; on the right the stat chips read **3 trigger conditions · 3 must-pass
   filters · 5 scoring factors**, weighted Skill 40 / Proximity 30.
4. Refine in the chat rail: *"Also make sure nobody on overtime is picked, and
   prefer the nearest engineer."*
5. The reply names what moved and the breakdown updates live — a fourth trigger
   ("Work can be absorbed by the in-house team"), a Cost filter ("Not on overtime
   or a contractor call-out rate"), weighting shifts to Proximity 40 / Skill 20.

The policy is composed from your words, so **type a prompt you'd want on your
portfolio** — it becomes the policy name and the AI summary.

### 2. The policy breakdown · `:115`

**The shot (~12 s):** a steady scroll across **Who's eligible → How they're
ranked**, ending on the weight bar. Don't scroll the whole page.

Good second clip: **How the AI interpreted your prompt** expanding — the assumptions
list is the honest-design beat.

`/dispatcher-agent/dispatch/policies/61` — "Life safety — immediate escalation",
the richest of the four. The full column, top to bottom:

1. Title, **AI Summary**, the **Emergency · Critical** chip and the stat chips.
2. **1 When it applies** — *"A ticket enters this policy only when it matches these
   conditions."* **If** "Category is Fire, Gas, Entrapment or Flood" **And**
   "Urgency is Emergency" **And** "Description mentions smoke, gas, trapped, or
   water near electrics".
3. **2 Who's eligible** — *"Hard requirements a technician must pass before any
   scoring happens."* Grouped: **Availability** (on the duty rota; not already on
   another P1) · **Certification** (current first-response cert) · **Location**
   (can reach the site within 15 minutes).
4. **3 How they're ranked** — the weight bar, then Skill 25% · Proximity 45% ·
   Availability 20% · Performance 10% · Cost 0%.
5. **4 Assignment** — *"The eligible technician with the highest score is
   recommended for the ticket."*
6. **The fine print** — **Full policy instructions** and **How the AI interpreted
   your prompt**, which lists the assumptions ("Assumed the duty rota is the source
   of truth…", "…SMS, not email", "Contract coverage is deliberately ignored").
   This last one is the honest-design beat — keep it in.

The left rail carries the original conversation that produced the policy, ending
in *"Good. Leave it like that."* — worth a pan.

### 3. Test rule → the playground · `:135`

**The shot (~15 s):** **Test Rule** → the rankings populate with **Top match** on
Cooltech FM. Pick the ticket *before* you start rolling — the picker is its own clip
if you want it.

Still on policy 61.

1. **Test this policy** (top right) → the **Playground** modal.
2. **Pick a ticket to test this policy against** → the modal becomes **Pick A
   Ticket**: all 12 tickets with ID, Ticket Name, Priority, Category, Status, a
   search box and "12 records · 1 / 2".
3. Select the radio on **#4800 Level 12 — no heating (AHU-04)** → **Add Ticket**.
4. Back in the Playground with the ticket summarised (description, #HVAC #Request,
   Tower A · Level 12) and a **Change Ticket** button.
5. **Test Rule** → **Staff Rankings**, "7 matched": **Cooltech FM 87** with the
   green **Top match** badge, Dan Okafor 74, Aoife Kelleher 68, Tom Beckett 66,
   Lena Fischer 63.

Rankings come from the policy's own weighting, so testing 61 then 62 back to back
gives a different winner — a good second beat.

### 4. The recommendation card · `:165`

**The shot (~10 s):** the card sitting there — *"Atom recommends · Priya Raman ·
96% match"* — then **How Atom decided** expanding. Open the ticket before you roll.

Two more clips from the same ticket: **Other matches** popping open, and **Assign**
flipping the card. Three short clips beat one long one here.

`/helpdesk/tickets`.

1. Pan the list first — most rows carry no dispatch data, and that contrast is the
   point. #4809 shows an **"Atom at …"** assignee stamp.
2. Open **"Flickering lights in the north stairwell"** (#4808, Unassigned). The
   detail pane opens beside the list.
3. The **Atom recommendation card** — *"Atom recommends"* · **Priya Raman** ·
   **96% match**, with the justification underneath.
4. **Other matches (2)** → popover: Lena Fischer **74% match**, Dan Okafor
   **52% match** — each with **its own Assign button**, so the override is real.
5. **How Atom decided** → the reasoning trail, one step at a time.
6. **Assign** → the ticket fills in and the kicker changes to **"Ranked by Atom"**
   (a person assigned it, so it's no longer an auto-assignment). It does *not* say
   "Assigned" — write the caption for what's on screen.

For the auto-assigned variant open **"Level 12 — no heating (AHU-04)"** (#4800):
kicker reads **"Auto-assigned by Atom"** and the trail runs all six steps — Request
analyzed → Policy matched → Requirements extracted → Candidates filtered → Scoring
calculated → Assignment finalized — including why the contract vendor was ruled
out. **#4809 Visitor parking barrier** is the third seeded one.

### 5. Technicians · `:181`

**The shot (~12 s):** open **Dan Okafor** and let the profile land — the
availability bar with its Break blocks and **Now** marker is the thing worth seeing.
Job History is a second clip.

`/dispatcher-agent/dispatch/technicians` — a grid of 7, each card showing avatar,
status chip, name, email and two trade lines with a **+N** overflow. Statuses run
AVAILABLE / ON_JOB / ON_BREAK.

1. Pan the grid, then search to filter.
2. Open **Dan Okafor** → **Technician Profile**, tagged **Internal**, TECH-700,
   `+44 7700 900101`. Tabs: **Details** · **Job History**.
3. **Details**: the **Availability** 24 h bar (00:00 / 06:00 / 12:00 / 18:00) with
   **Break** blocks and a **Now** marker — "Break 10:30 AM, 01:00 PM"; then
   **Skills** with ★ ratings (BMS diagnostics, Refrigerant handling, Pumps &
   valves), **Certifications**, **Applicable Territories**, and **Inventory** with
   quantities (Refrigerant gauge set × 1, Belt set × 6, Thermal camera, Filter set
   — AHU × 12).
4. **Job History** → WO-4800 "Level 12 — no heating (AHU-04)", Tower A · Level 12,
   Emergency, In progress, 2 hr ago; and WO-4806, Closed, 2 days ago.

### 6. Settings → Data Sources · `:198`

**The shot (~10 s):** the datasets list with its coverage counts ("12 of 14 fields
mapped", one **Paused**), then open one into the field mapping. This is the least
essential clip of the thirteen — keep it tight.

`/helpdesk/settings/data-sources` — *"Each dataset maps one module from a connected
system into Tickets or Technicians."*

1. **Connected systems** — Facilio, 4 → **Add a system**.
2. **Datasets** → **New dataset**. Four rows, each with a review count and coverage:
   Work orders → Tickets (12 of 14 fields mapped, 4 to review) · Employees →
   Technicians (7 of 10, 3 to review) · Service requests → Tickets (**Paused**,
   5 of 14) · Vendors → Technicians (5 of 10, 1 to review).
3. Open **Work orders → Tickets** → **Edit Dataset**: *"Map fields from your data
   source into your Tickets and Technicians."* **Sync into** → ticket · **Data
   source** → **Module** → Work Order · **Add field** · Cancel / **Save**.

> **Cut the "connector catalogue / request-a-connector modal" beat** — that screen
> isn't reachable in this build.

---

## How to work through it

**Record long, publish short.** Do one session per screen with the camera running,
then cut the 10-second pieces out of it. Re-setting the app for every clip is the
slow way.

Six sessions cover all thirteen slots:

1. **Onboarding** — one fresh boot, running through the ready modal and the phone
   step. Cut 4–5 clips: the crawl · the filled-in result · the ready modal · the OTP.
2. **Intake** — the General tab, then the four channel tabs. Cut 3–4: the hover
   glide · Scope of Work · Add Scenario · a channel tab.
3. **Inbox**, then **Feedback**. Cut 3: the Atom analysis · the transcript · the
   opening message with its variables.
4. **Policies** — write one, refine it, then read the breakdown. Cut 4: the draft ·
   the refine · the eligibility/ranking scroll · the AI assumptions.
5. **Test rule**, then the ticket it produces. Cut 4: the rankings · the
   recommendation card · Other matches · Assign.
6. **Technicians**, then **Data Sources**. Cut 3.

That's roughly **20 short clips from 13 slots** — more than you need, which is the
point: pick the best one per slot and keep the rest in reserve.

Helpdesk **5** (the voice Playground) is the only one needing the real product.
