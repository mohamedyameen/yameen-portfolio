import {
  Text,
  Section,
  Prose,
  Heading,
  Callout,
} from '@/components/works/body'
import { PhoneScene, PhoneWalkthrough } from '@/components/works/PhoneScene'

/** Cinematic atrium backdrop shared across every phone showcase in this
 *  case study — a connected building, echoing the product's domain. */
const BG = '/works/iot-automation/bg-atrium.jpg'

export default function Body() {
  return (
    <>
      <Section id="problem" label="The problem" tocLabel="The problem">
        <Prose>
          <Text>
            A smart thermostat is only smart while nothing changes. The moment
            it does — you leave early, work from home, fly out for a fortnight —
            most apps make you choose between two bad options: fight the
            automation by holding a manual temperature, or tear up the schedule
            and rebuild it later.
          </Text>
          <Text>
            The design goal was a control surface where the{' '}
            <strong>routine</strong> and the <strong>interruption</strong> are
            first-class citizens side by side. You should be able to set the
            week once, drop in a one-off change when life needs it, and trust
            that the plan resumes on its own — no cleanup, no forgotten holds
            silently costing energy.
          </Text>
        </Prose>
      </Section>

      <Section id="home" label="The control panel" tocLabel="Control panel">
        <Prose>
          <Text>
            Home is the live dashboard for the selected device (here,{' '}
            <em>ECY&nbsp;-&nbsp;STAT</em>). It answers the three questions
            someone actually walks in with — <strong>what is it right now</strong>,{' '}
            <strong>is the system even on</strong>, and{' '}
            <strong>can I change it</strong> — before anything else. Indoor
            temperature and the master power sit at the top, with outdoor
            weather, humidity, and the last sync time as supporting context.
          </Text>
        </Prose>
        <PhoneScene
          priority
          bg={BG}
          screens={[
            {
              src: '/works/iot-automation/home-on.jpg',
              alt: 'Home control panel, system on — 26°C indoor, cooling to a 24°C set point, occupancy set to Home, with outdoor 32°C, 55% humidity, and last sync time',
            },
            {
              src: '/works/iot-automation/home-off.jpg',
              alt: 'Home control panel, system off — the master toggle is red and every control below is greyed out and inactive',
            },
            {
              src: '/works/iot-automation/home-heat.jpg',
              alt: 'Home control panel in Heat mode — Away occupancy, 27°C set point on a warm amber slider, and a fan-speed card at 80%',
            },
          ]}
          caption="The panel on, off, and heating — the master toggle greys out every control when the system is off, so there's never a live-but-idle state."
        />
        <PhoneWalkthrough
          bg={BG}
          screen={{
            src: '/works/iot-automation/home-on.jpg',
            alt: 'Home control panel annotated — indoor temperature, occupancy modes, and the temperature set point with mode chips',
          }}
          notes={[
            {
              title: 'State before controls',
              body: 'Indoor temperature and the on/off toggle lead; outdoor temp, humidity, and “Thu 24 Nov | 5:45 PM” sit underneath as the context you glance at, not act on.',
            },
            {
              title: 'Occupancy is the big lever',
              body: 'Auto, Home, Away, and Vacation switch the whole comfort target in one tap — the fastest way to say “I’m here” or “I’m out” without touching a number.',
            },
            {
              title: 'Set point, then how',
              body: 'A −/+ stepper and a colour-coded slider set the target; the slider runs blue for cooling and warm amber for heating, so the mode is legible at a glance.',
            },
            {
              title: 'Mode as a row of chips',
              body: 'Power, Auto, Heat, and Cool live as one chip row — Cool is active here — so switching how the system reaches the target is a single, reversible choice.',
            },
          ]}
          caption="The home screen, read top to bottom — status, occupancy, target, mode."
        />
        <Prose>
          <Text>
            Switching to <strong>Heat</strong> proves the panel isn&apos;t
            static art: the slider warms to amber, the set point jumps to the
            heating target, and a <strong>fan-speed</strong> card slides in with
            its own slider and an Auto option. The controls that matter for the
            current mode appear; the ones that don&apos;t stay out of the way.
          </Text>
        </Prose>
      </Section>

      <Section id="comfort" label="Comfort profiles" tocLabel="Comfort profiles">
        <Prose>
          <Text>
            Underneath the panel sit <strong>comfort profiles</strong> — the
            named presets the whole system leans on. Rather than remember that
            &ldquo;home&rdquo; means 27° heating / 22° cooling at 40% fan, you
            set that once and every other surface — occupancy, schedule,
            exceptions — just refers to <em>Home</em>, <em>Away</em>, or{' '}
            <em>Vacation</em> by name.
          </Text>
        </Prose>
        <PhoneWalkthrough
          bg={BG}
          screen={{
            src: '/works/iot-automation/comfort-list.jpg',
            alt: 'Comfort Settings list — Home, Away, and Vacation profiles, each with a heating and cooling set point and a fan-speed value',
          }}
          notes={[
            {
              title: 'Three intents, plain-language',
              body: '“Keep your home cozy when you’re there,” “Save energy while you’re out,” “Use minimal energy for long trips” — each profile leads with why it exists, not just its numbers.',
            },
            {
              title: 'Heating and cooling in one row',
              body: 'A sun and snowflake line show both set points together, so a profile reads as a complete comfort stance rather than a single temperature.',
            },
            {
              title: 'Fan speed carries the energy story',
              body: 'Home runs 40% / 80%; Away and Vacation lean on Auto — the fan values are where the energy-saving intent actually shows up.',
            },
          ]}
          caption="The three profiles at a glance — each one a named bundle of heating, cooling, and fan, described by intent."
        />
        <Prose>
          <Text>
            Opening any profile reveals the full editor: separate{' '}
            <strong>Heating</strong> and <strong>Cooling</strong> blocks, each
            with a temperature set point and a fan-speed slider that can fall
            back to Auto. Vacation reframes the same controls as{' '}
            <em>Heat Preference</em> and <em>Cool Preference</em> — a small
            wording shift that signals &ldquo;keep it safe and minimal&rdquo;
            rather than &ldquo;keep it comfortable.&rdquo;
          </Text>
        </Prose>
        <PhoneScene
          bg={BG}
          screens={[
            {
              src: '/works/iot-automation/comfort-home.jpg',
              alt: 'Home comfort profile editor — Heating set point 27°C at 40% fan, Cooling set point 25°C at 80% fan, with Save Changes',
            },
            {
              src: '/works/iot-automation/comfort-away.jpg',
              alt: 'Away comfort profile editor — Heating 27°C at 40% fan, Cooling 24°C at 80% fan',
            },
            {
              src: '/works/iot-automation/comfort-vacation.jpg',
              alt: 'Vacation comfort profile editor — Heat Preference 27°C at 40% fan and Cool Preference 24°C at 80% fan',
            },
          ]}
          caption="Editing Home, Away, and Vacation — the same heating/cooling/fan anatomy every time, with Vacation reworded to “preference” to set expectations."
        />
        <Callout>
          Profiles are the single source of truth for comfort. Because every
          schedule block and exception points at a profile by name, changing
          &ldquo;Home&rdquo; once updates every place it&apos;s used — the app
          never asks anyone to re-enter the same three numbers twice.
        </Callout>
      </Section>

      <Section id="schedule" label="The schedule" tocLabel="Schedule">
        <Prose>
          <Text>
            The <strong>schedule</strong> is where the routine lives. A week
            strip sits above a vertical timeline of the day&apos;s comfort
            blocks — <em>Home</em> at 8:00 AM, <em>Away</em> at 9:00 AM — each
            showing the heating and cooling targets it will hold. It reads like
            a calendar, not a config screen.
          </Text>
        </Prose>
        <PhoneScene
          bg={BG}
          screens={[
            {
              src: '/works/iot-automation/schedule-timeline.jpg',
              alt: 'Schedule for Oct 2024 — a week strip with Wed 20 selected and a timeline showing Home at 8:00 AM and Away at 9:00 AM with their set points',
            },
            {
              src: '/works/iot-automation/schedule-add.jpg',
              alt: 'Add Activity sheet — Type toggle set to Schedule, comfort setting Home or Away, a day picker, and a start-time field',
            },
            {
              src: '/works/iot-automation/schedule-time.jpg',
              alt: 'Start-time wheel picker over the Add Activity sheet — hours, minutes, and AM/PM columns with 12:00 PM selected and a Done button',
            },
          ]}
          caption="The day timeline, the Add Activity sheet set to Schedule, and the wheel time picker — adding a block is pick a profile, pick days, pick a time."
        />
        <Prose>
          <Text>
            Adding a block is deliberately small: the <strong>Add
            Activity</strong> sheet asks only three things — which comfort
            profile, which day(s), and a start time. A repeating schedule block
            doesn&apos;t need an end time; the <em>next</em> block is the end.
            Add a midday <em>Home</em> block and the timeline becomes Home →
            Away → Home, the last one running &ldquo;Until Next Day.&rdquo;
          </Text>
        </Prose>
        <PhoneScene
          bg={BG}
          screens={[
            {
              src: '/works/iot-automation/schedule-full.jpg',
              alt: 'Schedule timeline with three blocks — Home at 8:00 AM, Away at 9:00 AM, and Home at 12:00 PM running until the next day',
            },
          ]}
          caption="A fuller day — each block simply hands off to the next, and the final one holds “Until Next Day.”"
        />
      </Section>

      <Section id="exceptions" label="Exceptions" tocLabel="Exceptions">
        <Prose>
          <Text>
            <strong>Exceptions</strong> are the answer to &ldquo;today is
            different.&rdquo; The very same Add Activity sheet has a{' '}
            <em>Type</em> toggle at the top — flip it from <em>Schedule</em> to{' '}
            <em>Exception</em> and the day-of-week picker is replaced by an
            explicit <strong>start and end date-time</strong>. One form,
            two jobs: the recurring plan and the one-off override.
          </Text>
        </Prose>
        <PhoneScene
          bg={BG}
          screens={[
            {
              src: '/works/iot-automation/exception-add.jpg',
              alt: 'Add Activity sheet with Type set to Exception — comfort setting Home, Away, or Vacation and empty start and end date-time fields',
            },
            {
              src: '/works/iot-automation/exception-add-filled.jpg',
              alt: 'Exception form with a start date filled in — 20-10-2024 at 9:00 AM, with the Vacation profile now showing its own set points',
            },
            {
              src: '/works/iot-automation/exception-timeline.jpg',
              alt: 'Schedule timeline with an exception applied — an orange Exception block at 9:00 AM overriding the struck-through Away block beneath it',
            },
          ]}
          caption="Exception mode swaps day-of-week for a date range; on the timeline it lands as an orange block that visibly overrides — not deletes — the schedule beneath."
        />
        <Callout>
          The override is honest about what it&apos;s doing. On the timeline the
          exception sits in orange with the schedule block it replaced shown
          <em> struck through, right beneath it</em> — so you can see both the
          plan and the interruption, and know the routine is still there
          waiting to resume.
        </Callout>
      </Section>

      <Section id="vacation" label="Vacation mode" tocLabel="Vacation">
        <Prose>
          <Text>
            A holiday is just a long exception, so it&apos;s built from the same
            parts. Pick the <strong>Vacation</strong> profile, then set a date
            range that can span months — a dedicated calendar makes selecting{' '}
            &ldquo;2 Jan to 10 Jan&rdquo; a single highlighted sweep rather than
            two fiddly pickers.
          </Text>
        </Prose>
        <PhoneScene
          bg={BG}
          screens={[
            {
              src: '/works/iot-automation/vacation-add.jpg',
              alt: 'Add Activity as an exception with the Vacation profile selected and a start and end date-time spanning from October to January',
            },
            {
              src: '/works/iot-automation/vacation-daterange.jpg',
              alt: 'Select Date And Time calendar — a January 2025 month grid with the 2nd to the 10th highlighted as a continuous range, plus a time field and Save',
            },
            {
              src: '/works/iot-automation/vacation-timeline.jpg',
              alt: 'Schedule timeline for Jan 2025 — Home at 8:00 AM and a purple Vacation block from 9:00 AM running until the next day',
            },
          ]}
          caption="Setting a vacation — pick the profile, sweep a date range on the calendar, and it lands on the timeline as a distinct purple block."
        />
        <Prose>
          <Text>
            When it&apos;s active, vacation is unmistakable: a purple block on
            the timeline, running its minimal-energy targets &ldquo;Until Next
            Day&rdquo; across the whole trip. And because it&apos;s an exception
            with an end date, the normal week snaps back the moment you&apos;re
            home — no stale holiday hold quietly running for another fortnight.
          </Text>
        </Prose>
      </Section>

      <Section id="settings" label="Settings & close" tocLabel="Settings">
        <Prose>
          <Text>
            Settings stays intentionally light — profile, theme, and an{' '}
            <strong>activity log</strong> that records what the system did and
            who changed what, plus the essentials of help and sign-out. For a
            device that mostly runs itself, the log is the trust anchor: it
            answers &ldquo;why is it 27° right now?&rdquo; after the fact.
          </Text>
        </Prose>
        <PhoneScene
          bg={BG}
          screens={[
            {
              src: '/works/iot-automation/settings.jpg',
              alt: 'Settings — General with Profile, Theme set to System, and Activity Log; a Help section with User Guide; and a Log out action, with the Facilio version at the bottom',
            },
          ]}
          caption="Settings — profile, theme, and an activity log, with help and sign-out. Deliberately shallow for a device that runs on autopilot."
        />
        <Prose>
          <Heading>What held it together</Heading>
          <Text>
            The through-line was one form and one vocabulary doing double duty.
            Comfort profiles name the &ldquo;how,&rdquo; the schedule places
            them in time, and the exact same Add Activity sheet — with a single
            Type toggle — produces both the recurring plan and the one-off
            override. That reuse is what let a genuinely capable automation
            surface stay small enough to run from a phone in a hallway.
          </Text>
          <Text>
            And every override is designed to be temporary by construction.
            Exceptions carry an end; the schedule is always visible beneath
            them; the routine resumes on its own. The app trusts the plan, and
            gives people a safe, legible way to step outside it when real life
            asks.
          </Text>
        </Prose>
      </Section>
    </>
  )
}
