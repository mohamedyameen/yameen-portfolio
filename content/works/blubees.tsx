import {
  Text,
  Section,
  Prose,
  Heading,
  Callout,
} from '@/components/works/body'
import { PhoneScene, PhoneWalkthrough } from '@/components/works/PhoneScene'
import { FlowGallery } from '@/components/works/FlowGallery'

export default function Body() {
  return (
    <>
      <Section id="problem" label="The problem" tocLabel="The problem">
        <Prose>
          <Text>
            Medical hiring in India runs on HR WhatsApp groups, phone trees,
            and word of mouth. A hospital that needs a radiologist for
            tomorrow&apos;s shift sends a message into a group, waits for
            calls, negotiates over the phone, and verifies documents in person
            on joining day. Nothing about the process is searchable,
            trackable, or reusable.
          </Text>
          <Text>
            The sharpest pain is <strong>substitution work</strong> — urgent,
            short-term cover for a doctor or technician who didn&apos;t turn
            up. That demands the one thing the current system can&apos;t do:
            instantly match a verified professional by speciality and
            location.
          </Text>
        </Prose>
      </Section>

      <Section id="research" label="Research" tocLabel="Research">
        <Prose>
          <Heading>Requirement gathering</Heading>
          <Text>
            We started by sitting with the client and writing down how hiring
            actually happens today. The pattern was the same everywhere: HR
            posts in a WhatsApp group, waits for calls, negotiates over the
            phone, and checks documents in person on joining day.
          </Text>
          <Text>
            That one picture set the must-haves: verified credentials before
            anyone can transact, a way to broadcast urgent openings, and
            in-app chat so negotiation happens in one traceable place instead
            of scattered calls.
          </Text>
        </Prose>
        <Prose>
          <Heading>Market study</Heading>
          <Text>
            Next, we scored four platforms in the space — Curaa, Docplexus,
            PlexusMD, and Among Doctors — on core features, ease of use,
            onboarding, and tone of voice. They are strong doctor communities
            and content platforms, but none of them takes a hospital from
            &ldquo;we need a radiologist tomorrow&rdquo; to a verified hire.
          </Text>
          <Text>
            That gap became the positioning: not another network for doctors,
            but the place where healthcare hiring actually completes.
          </Text>
        </Prose>
      </Section>

      <Section id="flows" label="User flows" tocLabel="User flows">
        <Prose>
          <Text>
            Before any UI, I mapped nine flows covering both sides of the
            marketplace — onboarding, listing a job, shortlisting, job
            alerts, applying, profile verification, feedback, chat, and
            customer support. Each one branches on the same axis the business
            does: immediate substitution versus long-term hiring.
          </Text>
        </Prose>

        <FlowGallery
          flows={[
            { src: '/works/blubees/flows/onboarding.jpg', title: 'On-boarding' },
            { src: '/works/blubees/flows/listing.jpg', title: 'Listing a job' },
            { src: '/works/blubees/flows/shortlisting.jpg', title: 'Shortlisting a profile' },
            { src: '/works/blubees/flows/alerts.jpg', title: 'Getting job alerts' },
            { src: '/works/blubees/flows/applying.jpg', title: 'Applying for a job' },
            { src: '/works/blubees/flows/profiles.jpg', title: 'Creating & verifying profiles' },
            { src: '/works/blubees/flows/feedback.jpg', title: 'Feedback on job completion' },
            { src: '/works/blubees/flows/chat.jpg', title: 'Chatting with the provider' },
            { src: '/works/blubees/flows/support.jpg', title: 'Customer support' },
          ]}
          caption="Nine user flows, one per core task — tap any diagram to read it full-screen."
        />

        <Callout>
          Every flow branches on the same axis the business does:{' '}
          <strong>immediate</strong> (substitution) versus{' '}
          <strong>long-term</strong> hiring. Getting that split right in the
          flows meant the UI only ever had to ask it once.
        </Callout>
      </Section>

      <Section id="onboarding" label="Onboarding & trust" tocLabel="Onboarding">
        <Prose>
          <Text>
            Trust is the product&apos;s currency, so verification is woven
            into onboarding rather than gated before it. Anyone can register
            and look around; a persistent banner then walks each persona
            through uploading registration documents — medical registration
            for doctors, licenses for technicians — before they can transact.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/onboarding.jpg',
              alt: 'Blubees welcome screen — find part-time or full-time medical jobs near you, with register and login',
            },
            {
              src: '/works/blubees/persona-picker.jpg',
              alt: 'What brings you to Blubees — persona picker with doctors, nurses, technician, institutions, agencies, and others',
            },
            {
              src: '/works/blubees/onboarding-details.jpg',
              alt: 'Tell us about you — personal and institutional details with a note to keep the medical registration document and ID proof ready for verification',
            },
          ]}
          caption="Welcome → pick your persona → tell us about you, with a heads-up to keep registration and ID ready for verification."
        />
        <Callout>
          Verification runs on a nudge model: browse freely, but the
          profile-completion card and document banner sit at the top of home
          until credentials are in — applying stays locked behind a complete,
          verified profile.
        </Callout>
      </Section>

      <Section id="institutions" label="For institutions" tocLabel="Institutions">
        <Prose>
          <Heading>Post a job, or go get the person</Heading>
          <Text>
            The institution home leads with the two actions that matter:
            post a job and browse professionals nearby. Job creation is one
            screen — professional type, speciality, urgency, work type
            (part-time, night duties, full-time, freelancing), location, and
            keyword tags that drive matching.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/inst-home.jpg',
              alt: 'Institution home — search for professionals, event alerts, and discover profiles by profession',
            },
            {
              src: '/works/blubees/inst-jobboard.jpg',
              alt: 'Institution job board — tabs for all, open, reviewing, and closed jobs with application counts',
            },
            {
              src: '/works/blubees/inst-job-detail.jpg',
              alt: 'A posted job from the institution side — details, application statistics of in-review, shortlisted, and rejected counts, with withdraw job and see applications',
            },
          ]}
          caption="Institution home, the job board, and a single posting — status tabs up front, and each job opens to live application statistics."
        />
        <PhoneWalkthrough
          screen={{
            src: '/works/blubees/job-create.jpg',
            alt: 'Create a job — title, professional type chips, speciality, type of work, location, and keyword tags',
          }}
          notes={[
            {
              title: 'Urgency lives in the title',
              body: 'Free-form up to 150 characters, with a nudge to stay under 100 — real postings read like the ward talks: “!!URGENT!! Radiologist Required!!”.',
            },
            {
              title: 'Persona chips pick the audience',
              body: 'Doctors, nurses, technicians, hygiene workers, drivers — the chip decides which speciality and experience fields appear below.',
            },
            {
              title: 'Type of work = type of hire',
              body: 'Part-time, holiday/night duties, full-time, freelancing — this is the immediate-versus-long-term split, made a single visible choice.',
            },
            {
              title: 'Tags drive the matching',
              body: 'At least four keywords (“#DMRD, #Consultant Radiologist”) feed location-based matching and job alerts on the seeker side.',
            },
          ]}
          caption="Job creation, annotated — one screen decides who sees the post and how fast."
        />
        <Prose>
          <Text>
            The same form flexes across personas: pick hygiene workers and a
            worker-count stepper appears — &ldquo;Cleaning help required, min
            20 workers&rdquo; is as valid a posting as a consultant
            radiologist. Institutions also don&apos;t hire alone: an HR
            intern can be invited with granular permissions — edit jobs and
            act on applications, but not create or invite.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/job-create-workers.jpg',
              alt: 'Create a job for hygiene workers — number of workers stepper and worker-specific fields',
            },
            {
              src: '/works/blubees/job-created.jpg',
              alt: 'Job successfully created confirmation dialog over the create-a-job form',
            },
            {
              src: '/works/blubees/invite-members.jpg',
              alt: 'Invite members — add a colleague by mail, choose their role, and grant per-action permissions',
            },
          ]}
          caption="Bulk postings for support staff, the confirmation moment, and team roles with per-action permissions."
        />
      </Section>

      <Section id="network" label="The network" tocLabel="The network">
        <Prose>
          <Text>
            Because waiting for applicants doesn&apos;t work for
            substitution, the Network tab flips the direction: a browsable
            repository of institutions, doctors, nurses, and technicians
            nearby, with ratings and availability up front. Payments close
            the loop without leaving the app.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/network.jpg',
              alt: 'Your Network — nearby institutions with speciality, distance, rating, and hiring-now badges',
            },
            {
              src: '/works/blubees/network-doctors.jpg',
              alt: 'Your Network, Doctors tab — nearby doctors with speciality, experience, distance, available-ASAP badges, and ratings',
            },
            {
              src: '/works/blubees/network-filter.jpg',
              alt: 'Filter the network — years of experience, distance from you, and speciality, applied over the network list',
            },
          ]}
          caption="Browse the repository by persona — institutions, doctors, nurses, technicians — with ratings and availability up front, then filter by experience, distance, and speciality."
        />
        <PhoneWalkthrough
          screen={{
            src: '/works/blubees/doctor-profile.jpg',
            alt: 'Doctor profile — Dr. Isabella Morgan, senior neurologist, available ASAP, with registration number, rating, and known-for traits',
          }}
          notes={[
            {
              title: 'Verified identity first',
              body: 'Medical registration number sits directly under the name — the credential a hospital checks before anything else.',
            },
            {
              title: 'Availability as a badge',
              body: '“Available ASAP” plus the engagement type (freelancing/consultation) answers the substitution question at a glance.',
            },
            {
              title: 'Reputation from peers',
              body: '“Known for” traits — punctuality, approachability, leadership — accumulate from post-job feedback, not self-description.',
            },
            {
              title: 'Two actions, both instant',
              body: 'Check availability or chat now — negotiation starts on-platform instead of over an unlogged phone call.',
            },
          ]}
          caption="The profile is built to be hired from — credentials, availability, reputation, then contact."
        />
      </Section>

      <Section id="reputation" label="Profiles & reputation" tocLabel="Profiles & reputation">
        <Prose>
          <Text>
            And institutions are profiles too. A hospital carries the same
            kind of page — highlights, branches, a point of contact — plus a
            public reputation built from two-way ratings after every job, so
            accountability runs in both directions rather than only towards
            the people being hired.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/institution-profile.jpg',
              alt: 'Institution profile — Unity Community Hospital with description, highlights like health insurance and job training, location, website, point of contact, and other branches',
            },
            {
              src: '/works/blubees/ratings.jpg',
              alt: 'Ratings and reviews — an overall star rating with a per-aspect breakdown of experience, staff, management, and facilities, plus individual reviews',
            },
          ]}
          caption="Institutions get a profile of their own — highlights, branches, and a reputation scored by professionals across experience, staff, management, and facilities."
        />
      </Section>

      <Section id="business" label="Advertising & plans" tocLabel="Advertising & plans">
        <Prose>
          <Text>
            Hospitals can also raise their own visibility — a paid{' '}
            &ldquo;Start advertising&rdquo; slot promotes a new speciality
            across the network — and when a hire lands, payment closes the loop
            on-platform with UPI or a saved card, so nothing spills back into
            phone calls and bank transfers.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/advertise.jpg',
              alt: 'Start advertising — title, advertisement type, media upload, and toggles to advertise app-wide, among institutions, or among doctors and technicians',
            },
            {
              src: '/works/blubees/payments.jpg',
              alt: 'Make payments — UPI options, saved cards, and total amount with pay now',
            },
            {
              src: '/works/blubees/payment-card.jpg',
              alt: 'Add new card sheet — card number, name, expiry, CVV, and save-for-future toggle over the payments screen',
            },
          ]}
          caption="Advertise a speciality, then pay on-platform — UPI or a saved card, all without leaving Blubees."
        />
        <Prose>
          <Text>
            The business model stays out of the way: a free plan already
            covers the essentials — posting, application tracking, immediate
            listings, and chat — while a premium plan layers on express
            posting, chat-and-call support, insider job-trend data, and
            early access to events, so the marketplace works before anyone
            pays for it.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/plan-details.jpg',
              alt: 'Plan details — a free current plan with key features listed, and a premium plan with express posting, chat and call support, insider job trends, and early event access, with an upgrade now button',
            },
          ]}
          caption="Free versus premium — the free tier carries the core workflow; premium adds express access, richer support, and trend data."
        />
      </Section>

      <Section id="seekers" label="For professionals" tocLabel="Professionals">
        <Prose>
          <Text>
            The seeker side mirrors the same anatomy. Home opens on
            &ldquo;Jobs Hand Picked for You&rdquo; — matched on speciality
            and location — and a job page answers everything a call would
            have: dates, exact address, experience asked, responsibilities,
            and the matching tags, with apply, save, and refer-a-friend one
            row away.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/pro-home.jpg',
              alt: 'Professional home with a profile-completion card and jobs hand picked for you',
            },
            {
              src: '/works/blubees/job-details.jpg',
              alt: 'Job details — urgent radiologist posting with dates, location, experience, description, and apply, save, and refer actions',
            },
            {
              src: '/works/blubees/pro-register-gate.jpg',
              alt: 'Job details with a register-first dialog — you need to register and verify before you can apply for jobs',
            },
          ]}
          caption="Personalised home and the job page — everything a phone call used to cover, on one screen — with applying gated behind a verified profile."
        />
        <Prose>
          <Text>
            Two things keep the seeker side pointed at substitution. An
            availability calendar lets a professional block the days they can
            work — or flip a single &ldquo;Available ASAP&rdquo; switch — so
            matching only pings them when it fits, and a refer-a-friend sheet
            pushes a role straight into the channels hiring already lives on:
            chat, WhatsApp, mail, or a copied link.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/set-availability.jpg',
              alt: 'Set availability — a monthly calendar with today, holiday, and availability legends, per-weekday quick actions, and a set-availability-as-ASAP toggle',
            },
            {
              src: '/works/blubees/refer-friend.jpg',
              alt: 'Refer a friend sheet over a job posting — share the role via chat, WhatsApp, mail, or copy link',
            },
          ]}
          caption="Availability drives matching — mark the days you can work, or toggle ASAP — and any job can be referred onward through the channels hiring already uses."
        />
        <Prose>
          <Text>
            The job board carries urgency in its titles and tags —
            substitution posts read differently from full-time ones — and
            Applications tracks every submission through under review,
            shortlisted, and rejected, so the phone-call limbo of &ldquo;did
            they see my CV?&rdquo; becomes a status chip. Even a rejection
            arrives as a written reason rather than silence.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/pro-jobboard.jpg',
              alt: 'Professional job board — all and saved tabs with urgent substitution and full-time postings',
            },
            {
              src: '/works/blubees/applications.jpg',
              alt: 'Applications — submissions tracked across under review, shortlisted, and rejected tabs',
            },
            {
              src: '/works/blubees/application-rejected.jpg',
              alt: 'Reasons to reject sheet over the applications list — a written explanation of why an application was not taken forward, with a view-job-description action',
            },
          ]}
          caption="Seeker side — the board carries urgency in its tags, applications become status chips, and a rejection closes the loop with an actual reason."
        />
      </Section>

      <Section id="agencies" label="For agencies" tocLabel="Agencies">
        <Prose>
          <Text>
            Recruitment agencies get a persona of their own — the same home,
            plus bulk tools: add workers manually or import an entire roster
            from an Excel template, then advertise the pool to nearby
            institutions.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/agency-home.jpg',
              alt: 'Recruitment agency home — verification banner and add-profiles-to-list with import from Excel',
            },
            {
              src: '/works/blubees/add-worker.jpg',
              alt: 'Add worker profiles — upload an Excel roster or add manually, with service selection and photo ID',
            },
            {
              src: '/works/blubees/agency-add-done.jpg',
              alt: 'Worker profile added successfully — confirmation dialog over the add-worker form',
            },
          ]}
          caption="Agencies list a whole roster — import from Excel or add workers one by one with ID proof, each landing in their repository."
        />
        <Prose>
          <Text>
            That roster becomes a searchable Repository — every worker with a
            trade, tenure, distance, and rating up front — and the agency
            works against institution postings directly: open a job like
            &ldquo;Cleaning help required, min 20 workers&rdquo; and commit
            the contract in one tap. Agencies are verified entities too,
            carrying a registration number, certificate, and the services
            they staff on a profile of their own.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/agency-repository.jpg',
              alt: 'Agency repository — a searchable list of worker profiles (cleaner, driver, admin, multi-specialty) with tenure, distance, and ratings, plus an add-worker-profile button',
            },
            {
              src: '/works/blubees/agency-contract-detail.jpg',
              alt: 'A bulk hygiene-worker posting from the agency side — Arogya Health Hospital, hygiene workers, full-time, with description, matching tags, and a commit-contract action',
            },
            {
              src: '/works/blubees/agency-profile.jpg',
              alt: 'Agency details — agency name, team size, registration number, year of establishment, address, registration certificate, and the services provided',
            },
          ]}
          caption="The roster is a searchable repository, institution postings are committed as contracts, and the agency carries its own verified profile — registration number, certificate, and services staffed."
        />
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/agency-contracts-home.jpg',
              alt: 'Agency home — upcoming job contracts card with an accepted radiologist placement and a post-job experience feedback sheet',
            },
            {
              src: '/works/blubees/agency-contracts.jpg',
              alt: 'Contracts — all, saved, applied, and completed tabs with placements marked selected, rejected, and reviewing',
            },
          ]}
          caption="Agencies track placements as contracts — upcoming, applied, completed — and rate the experience once a job closes."
        />
      </Section>

      <Section id="support" label="Support workers" tocLabel="Support workers">
        <Prose>
          <Text>
            Support workers — cleaners, drivers, hygiene staff — get the
            lightest path of all, and it starts at sign-up. There is no email
            or password: register with a phone number, verify with an OTP, and
            give only what matching needs — name, locality pincode, and the
            services you offer. A &ldquo;Request call to register&rdquo; escape
            hatch covers anyone who can&apos;t get through on their own.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/support-register-phone.jpg',
              alt: 'Register with phone number — a single +91 phone field with a send-OTP-to-verify action',
            },
            {
              src: '/works/blubees/support-otp.jpg',
              alt: 'Enter OTP — four-digit code entry with a resend option and continue-registration action',
            },
            {
              src: '/works/blubees/support-details.jpg',
              alt: 'Tell us about you — name, gender, date of birth, and locality pincode, a cleaning/driving/admin service picker, and a request-call-to-register fallback',
            },
          ]}
          caption="Phone number → OTP → the few details matching needs — no email, no password, with a request-a-call fallback for anyone who needs it."
        />
        <Prose>
          <Text>
            From there the home meets them where hiring already happens —
            WhatsApp city and rural job groups to join, plus
            location-matched jobs — and verification asks only for a photo ID
            (Aadhaar front and back) rather than the medical registration a
            doctor would upload.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/other-worker-home.jpg',
              alt: 'Support-worker home — profile-verification banner, WhatsApp city and rural job groups to join, and location-matched jobs hand picked for you',
            },
            {
              src: '/works/blubees/support-profile.jpg',
              alt: 'Support-worker profile — a hygiene worker with phone number, gender, and date of birth, an Aadhaar front-and-back photo ID, and links to ratings, plan, and chat',
            },
          ]}
          caption="The home leans on WhatsApp groups and location matching; the profile verifies with a photo ID alone — the fourth persona, met entirely on its own terms."
        />
      </Section>

      <Section id="close" label="Reflection" tocLabel="Reflection" className="lg:mt-40">
        <Prose>
          <Text>
            The design problem underneath Blubees was symmetry: four personas,
            one marketplace, and every flow existing twice — once from the
            side that posts and once from the side that applies. Keeping the
            two sides on shared anatomy (same board, same status chips, same
            profile card) is what kept a three-sided product from feeling like
            three products.
          </Text>
          <Text>
            The other constant was trust. Document verification, two-way
            feedback after every job, and ratings on both profiles and
            institutions aren&apos;t features on top of the marketplace —
            they&apos;re what lets a hospital hand tomorrow&apos;s shift to
            someone it has never met.
          </Text>
        </Prose>
      </Section>
    </>
  )
}
