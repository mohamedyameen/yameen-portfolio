import {
  Text,
  Section,
  Prose,
  Points,
  Point,
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
            A smart thermostat is only smart while nothing changes. Leave
            early, work from home, fly out — and most apps make you fight the
            automation or tear up the schedule.
          </Text>
          <Text>
            <strong>The goal:</strong> set the week once, drop in a one-off
            change, and trust the plan to resume on its own.
          </Text>
        </Prose>
      </Section>

      <Section id="approach" label="The idea" tocLabel="Approach">
        <Prose>
          <Points numbered>
            <Point lead="Profiles name the comfort.">
              Home, Away, Vacation — set the numbers once, refer to them by
              name.
            </Point>
            <Point lead="The schedule places them in time.">
              A day is just blocks handing off to each other.
            </Point>
            <Point lead="Exceptions sit on top, never instead.">
              Every override has an end date, and the routine stays visible
              beneath it.
            </Point>
          </Points>
        </Prose>
      </Section>

      <Section id="home" label="The control panel" tocLabel="Control panel">
        <Prose>
          <Text>
            Home answers three questions in order: what is it right now, is the
            system on, can I change it.
          </Text>
          <Text>
            Switch to Heat and the slider warms to amber and a fan-speed card
            slides in. Only the current mode&apos;s controls appear.
          </Text>
        </Prose>
        <PhoneScene
          priority
          bg={BG}
          screens={[
            {
              src: '/works/iot-automation/home-on.jpg',
              alt: 'Home control panel, system on — 26°C indoor, cooling to a 24°C set point, occupancy set to Home',
            },
            {
              src: '/works/iot-automation/home-off.jpg',
              alt: 'Home control panel, system off — the master toggle is red and every control is greyed out',
            },
            {
              src: '/works/iot-automation/home-heat.jpg',
              alt: 'Home control panel in Heat mode — 27°C set point on an amber slider with a fan-speed card at 80%',
            },
          ]}
          caption="On, off, and heating — off greys out every control."
        />
        <PhoneWalkthrough
          bg={BG}
          screen={{
            src: '/works/iot-automation/home-on.jpg',
            alt: 'Home control panel annotated — indoor temperature, occupancy modes, set point, and mode chips',
          }}
          notes={[
            {
              title: 'State before controls',
              body: 'Indoor temperature and power lead; weather and last sync are context.',
            },
            {
              title: 'Occupancy is the big lever',
              body: 'Auto, Home, Away, Vacation — one tap switches the whole target.',
            },
            {
              title: 'Set point, colour-coded',
              body: 'Blue for cooling, amber for heating.',
            },
            {
              title: 'Mode as chips',
              body: 'Power, Auto, Heat, Cool — one reversible choice.',
            },
          ]}
          caption="Top to bottom — status, occupancy, target, mode."
        />
      </Section>

      <Section id="comfort" label="Comfort profiles" tocLabel="Comfort profiles">
        <Prose>
          <Text>
            Three named presets, each a bundle of heating, cooling and fan
            speed, described by intent rather than numbers. Vacation reframes
            the same editor as &ldquo;preference&rdquo; — keep it safe, not
            comfortable.
          </Text>
        </Prose>
        <PhoneWalkthrough
          bg={BG}
          screen={{
            src: '/works/iot-automation/comfort-list.jpg',
            alt: 'Comfort Settings list — Home, Away, and Vacation profiles with heating, cooling, and fan values',
          }}
          notes={[
            {
              title: 'Intent first',
              body: '“Keep your home cozy when you’re there” — each profile leads with why.',
            },
            {
              title: 'Heating and cooling together',
              body: 'A profile is a complete comfort stance, on one line.',
            },
            {
              title: 'Fan carries the energy story',
              body: 'Home runs 40% / 80%; Away and Vacation lean on Auto.',
            },
          ]}
          caption="Three profiles at a glance."
        />
        <PhoneScene
          bg={BG}
          screens={[
            {
              src: '/works/iot-automation/comfort-home.jpg',
              alt: 'Home comfort profile editor — Heating 27°C at 40% fan, Cooling 25°C at 80% fan',
            },
            {
              src: '/works/iot-automation/comfort-away.jpg',
              alt: 'Away comfort profile editor — Heating 27°C at 40% fan, Cooling 24°C at 80% fan',
            },
            {
              src: '/works/iot-automation/comfort-vacation.jpg',
              alt: 'Vacation comfort profile editor — Heat Preference and Cool Preference',
            },
          ]}
          caption="Home, Away, Vacation — the same anatomy every time."
        />
        <Callout>
          Profiles are the single source of truth. Change &ldquo;Home&rdquo;
          once and every block and exception pointing at it updates.
        </Callout>
      </Section>

      <Section id="schedule" label="The schedule" tocLabel="Schedule">
        <Prose>
          <Text>
            A week strip over a timeline of comfort blocks — a calendar, not a
            config screen.
          </Text>
          <Text>
            Adding a block asks three things: which profile, which days, what
            start time. No end time — the next block is the end.
          </Text>
        </Prose>
        <PhoneScene
          bg={BG}
          screens={[
            {
              src: '/works/iot-automation/schedule-timeline.jpg',
              alt: 'Schedule — a week strip and a timeline showing Home at 8:00 AM and Away at 9:00 AM',
            },
            {
              src: '/works/iot-automation/schedule-add.jpg',
              alt: 'Add Activity sheet — Type set to Schedule, comfort setting, day picker, and start time',
            },
            {
              src: '/works/iot-automation/schedule-time.jpg',
              alt: 'Start-time wheel picker over the Add Activity sheet',
            },
          ]}
          caption="Pick a profile, pick days, pick a time."
        />
        <PhoneScene
          bg={BG}
          screens={[
            {
              src: '/works/iot-automation/schedule-full.jpg',
              alt: 'Schedule timeline with three blocks — Home, Away, and Home running until the next day',
            },
          ]}
          caption="Each block hands off to the next; the last one holds “Until Next Day.”"
        />
      </Section>

      <Section id="exceptions" label="Exceptions" tocLabel="Exceptions">
        <Prose>
          <Text>
            &ldquo;Today is different.&rdquo; Flip the same sheet&apos;s Type
            toggle to Exception and the day picker becomes a start and end.
            One form, two jobs.
          </Text>
        </Prose>
        <PhoneScene
          bg={BG}
          screens={[
            {
              src: '/works/iot-automation/exception-add.jpg',
              alt: 'Add Activity sheet with Type set to Exception — profile picker and start and end date-time fields',
            },
            {
              src: '/works/iot-automation/exception-add-filled.jpg',
              alt: 'Exception form with a start date filled in and the Vacation profile selected',
            },
            {
              src: '/works/iot-automation/exception-timeline.jpg',
              alt: 'Schedule timeline with an orange Exception block overriding the struck-through Away block beneath it',
            },
          ]}
          caption="The exception lands as an orange block that overrides — not deletes — the schedule."
        />
        <Callout>
          The replaced block stays <em>struck through, right beneath it</em> —
          you see both the plan and the interruption.
        </Callout>
      </Section>

      <Section id="vacation" label="Vacation mode" tocLabel="Vacation">
        <Prose>
          <Text>
            A holiday is just a long exception. Pick Vacation, sweep a date
            range, and it lands as a purple block. Because it has an end date,
            the normal week snaps back the moment you&apos;re home.
          </Text>
        </Prose>
        <PhoneScene
          bg={BG}
          screens={[
            {
              src: '/works/iot-automation/vacation-add.jpg',
              alt: 'Add Activity as an exception with the Vacation profile and a date range spanning months',
            },
            {
              src: '/works/iot-automation/vacation-daterange.jpg',
              alt: 'Select Date And Time calendar — January 2nd to 10th highlighted as a continuous range',
            },
            {
              src: '/works/iot-automation/vacation-timeline.jpg',
              alt: 'Schedule timeline for January — Home at 8:00 AM and a purple Vacation block until the next day',
            },
          ]}
          caption="Pick the profile, sweep a range, done."
        />
      </Section>

      <Section id="settings" label="Settings" tocLabel="Settings">
        <Prose>
          <Text>
            Deliberately shallow. The one thing that matters is the activity
            log — for a device that runs itself, it answers &ldquo;why is it
            27° right now?&rdquo;
          </Text>
        </Prose>
        <PhoneScene
          bg={BG}
          screens={[
            {
              src: '/works/iot-automation/settings.jpg',
              alt: 'Settings — Profile, Theme, Activity Log, User Guide, and Log out',
            },
          ]}
          caption="Light on purpose, with the activity log as the trust anchor."
        />
      </Section>

      <Section id="close" label="What held it together" tocLabel="Reflection" className="lg:mt-40">
        <Prose>
          <Text>
            One form and one vocabulary doing double duty. Profiles name the
            comfort, the schedule places it in time, and a single Type toggle
            turns the same sheet into either the routine or the override — and
            every override ends on its own.
          </Text>
        </Prose>
      </Section>
    </>
  )
}
