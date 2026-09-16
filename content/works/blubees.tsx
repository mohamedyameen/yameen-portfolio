import {
  Text,
  Section,
  Prose,
  Points,
  Point,
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
            Medical hiring in India runs on WhatsApp groups and phone calls. A
            hospital that needs a radiologist tomorrow posts in a group and
            waits.
          </Text>
          <Text>
            The sharpest pain is <strong>substitution</strong> — urgent cover
            for someone who didn&apos;t turn up. That needs the one thing the
            current system can&apos;t do: instantly match a verified
            professional by speciality and location.
          </Text>
        </Prose>
      </Section>

      <Section id="research" label="Research" tocLabel="Research">
        <Prose>
          <Points>
            <Point lead="Requirements.">
              Verified credentials before anyone transacts, a broadcast for
              urgent openings, and in-app chat so negotiation is traceable.
            </Point>
            <Point lead="Market.">
              Curaa, Docplexus, PlexusMD and Among Doctors are strong
              communities — none takes a hospital from &ldquo;we need a
              radiologist tomorrow&rdquo; to a verified hire.
            </Point>
          </Points>
        </Prose>
      </Section>

      <Section id="flows" label="User flows" tocLabel="User flows">
        <Prose>
          <Text>
            Nine flows mapped before any UI, covering both sides of the
            marketplace.
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
          caption="One flow per core task — tap any diagram to read it full-screen."
        />
        <Callout>
          Every flow branches on the same axis the business does:{' '}
          <strong>immediate</strong> versus <strong>long-term</strong> hiring.
          Get that split right and the UI only has to ask it once.
        </Callout>
      </Section>

      <Section id="onboarding" label="Onboarding & trust" tocLabel="Onboarding">
        <Prose>
          <Text>
            Anyone can register and look around. A persistent banner walks each
            persona through uploading registration documents — applying stays
            locked until they&apos;re verified.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/onboarding.jpg',
              alt: 'Blubees welcome screen — find medical jobs near you, with register and login',
            },
            {
              src: '/works/blubees/persona-picker.jpg',
              alt: 'Persona picker — doctors, nurses, technicians, institutions, agencies, and others',
            },
            {
              src: '/works/blubees/onboarding-details.jpg',
              alt: 'Tell us about you — details form with a note to keep registration and ID proof ready',
            },
          ]}
          caption="Welcome → persona → details. Browse freely, transact once verified."
        />
      </Section>

      <Section id="institutions" label="For institutions" tocLabel="Institutions">
        <Prose>
          <Text>
            Home leads with two actions: post a job, or browse professionals
            nearby. Job creation is one screen, and the form flexes — pick
            hygiene workers and a worker-count stepper appears.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/inst-home.jpg',
              alt: 'Institution home — search for professionals and discover profiles by profession',
            },
            {
              src: '/works/blubees/inst-jobboard.jpg',
              alt: 'Institution job board — open, reviewing, and closed tabs with application counts',
            },
            {
              src: '/works/blubees/inst-job-detail.jpg',
              alt: 'A posted job — application statistics for in-review, shortlisted, and rejected',
            },
          ]}
          caption="Home, the job board, and a posting with live application stats."
        />
        <PhoneWalkthrough
          screen={{
            src: '/works/blubees/job-create.jpg',
            alt: 'Create a job — title, professional type chips, speciality, type of work, location, and tags',
          }}
          notes={[
            {
              title: 'Urgency lives in the title',
              body: 'Real postings read like the ward talks: “!!URGENT!! Radiologist Required!!”',
            },
            {
              title: 'Persona chips pick the audience',
              body: 'The chip decides which fields appear below.',
            },
            {
              title: 'Type of work = type of hire',
              body: 'Part-time, night duty, full-time, freelance — immediate versus long-term, as one choice.',
            },
            {
              title: 'Tags drive the matching',
              body: 'Keywords feed location matching and job alerts.',
            },
          ]}
          caption="One screen decides who sees the post and how fast."
        />
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/job-create-workers.jpg',
              alt: 'Create a job for hygiene workers — number-of-workers stepper',
            },
            {
              src: '/works/blubees/job-created.jpg',
              alt: 'Job successfully created confirmation',
            },
            {
              src: '/works/blubees/invite-members.jpg',
              alt: 'Invite members — add a colleague, choose their role, grant per-action permissions',
            },
          ]}
          caption="Bulk postings for support staff, and team roles with per-action permissions."
        />
      </Section>

      <Section id="network" label="The network" tocLabel="The network">
        <Prose>
          <Text>
            Waiting for applicants doesn&apos;t work for substitution, so the
            Network tab flips the direction: browse verified professionals
            nearby with rating and availability up front, and chat instantly.
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
              alt: 'Your Network, Doctors tab — nearby doctors with available-ASAP badges and ratings',
            },
            {
              src: '/works/blubees/network-filter.jpg',
              alt: 'Filter the network — years of experience, distance, and speciality',
            },
          ]}
          caption="Browse by persona, filter by experience, distance and speciality."
        />
        <PhoneWalkthrough
          screen={{
            src: '/works/blubees/doctor-profile.jpg',
            alt: 'Doctor profile — senior neurologist, available ASAP, with registration number, rating, and known-for traits',
          }}
          notes={[
            {
              title: 'Verified identity first',
              body: 'Registration number under the name — the credential a hospital checks first.',
            },
            {
              title: 'Availability as a badge',
              body: '“Available ASAP” answers the substitution question at a glance.',
            },
            {
              title: 'Reputation from peers',
              body: '“Known for” traits come from post-job feedback, not self-description.',
            },
            {
              title: 'Two instant actions',
              body: 'Check availability or chat now — negotiation stays on-platform.',
            },
          ]}
          caption="A profile built to be hired from."
        />
      </Section>

      <Section id="reputation" label="Two-way reputation" tocLabel="Reputation">
        <Prose>
          <Text>
            Institutions are profiles too, with a public rating from
            professionals after every job. Accountability runs in both
            directions.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/institution-profile.jpg',
              alt: 'Institution profile — description, highlights, location, point of contact, and other branches',
            },
            {
              src: '/works/blubees/ratings.jpg',
              alt: 'Ratings and reviews — overall rating with a breakdown of experience, staff, management, and facilities',
            },
          ]}
          caption="Hospitals get scored on experience, staff, management and facilities."
        />
      </Section>

      <Section id="business" label="Advertising & plans" tocLabel="Business">
        <Prose>
          <Text>
            Promote a speciality across the network and pay on-platform with
            UPI or a saved card. A free plan covers the core workflow; premium
            adds express posting and job-trend data.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/advertise.jpg',
              alt: 'Start advertising — title, type, media upload, and audience toggles',
            },
            {
              src: '/works/blubees/payments.jpg',
              alt: 'Make payments — UPI options, saved cards, and pay now',
            },
            {
              src: '/works/blubees/plan-details.jpg',
              alt: 'Plan details — free current plan and a premium plan with an upgrade button',
            },
          ]}
          caption="Advertise, pay, upgrade — without leaving Blubees."
        />
      </Section>

      <Section id="seekers" label="For professionals" tocLabel="Professionals">
        <Prose>
          <Text>
            Home opens on jobs picked by speciality and location, and a single
            &ldquo;Available ASAP&rdquo; switch keeps matching pointed at
            substitution. Applications become status chips, and even a
            rejection arrives with a written reason.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/pro-home.jpg',
              alt: 'Professional home — profile-completion card and jobs hand picked for you',
            },
            {
              src: '/works/blubees/job-details.jpg',
              alt: 'Job details — urgent radiologist posting with dates, location, and apply, save, refer actions',
            },
            {
              src: '/works/blubees/pro-register-gate.jpg',
              alt: 'Job details with a register-and-verify-first dialog',
            },
          ]}
          caption="A personalised home and the job page — applying gated behind verification."
        />
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/set-availability.jpg',
              alt: 'Set availability — monthly calendar with per-weekday quick actions and an ASAP toggle',
            },
            {
              src: '/works/blubees/refer-friend.jpg',
              alt: 'Refer a friend — share via chat, WhatsApp, mail, or copy link',
            },
            {
              src: '/works/blubees/applications.jpg',
              alt: 'Applications — under review, shortlisted, and rejected tabs',
            },
          ]}
          caption="Mark the days you can work, refer a role onward, track every application."
        />
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/pro-jobboard.jpg',
              alt: 'Professional job board — urgent substitution and full-time postings',
            },
            {
              src: '/works/blubees/application-rejected.jpg',
              alt: 'Reasons to reject sheet — a written explanation of why an application was not taken forward',
            },
          ]}
          caption="Urgency reads in the tags; a rejection closes the loop with a reason."
        />
      </Section>

      <Section id="agencies" label="For agencies" tocLabel="Agencies">
        <Prose>
          <Text>
            Agencies bring a roster, not a résumé. Import workers from Excel,
            open a bulk posting like &ldquo;Cleaning help, min 20
            workers,&rdquo; and commit the contract in one tap.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/agency-home.jpg',
              alt: 'Recruitment agency home — verification banner and add-profiles with import from Excel',
            },
            {
              src: '/works/blubees/add-worker.jpg',
              alt: 'Add worker profiles — upload an Excel roster or add manually with photo ID',
            },
            {
              src: '/works/blubees/agency-repository.jpg',
              alt: 'Agency repository — searchable worker profiles with tenure, distance, and ratings',
            },
          ]}
          caption="Import a roster or add workers one by one."
        />
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/agency-contract-detail.jpg',
              alt: 'A bulk hygiene-worker posting from the agency side with a commit-contract action',
            },
            {
              src: '/works/blubees/agency-contracts.jpg',
              alt: 'Contracts — all, saved, applied, and completed tabs',
            },
            {
              src: '/works/blubees/agency-profile.jpg',
              alt: 'Agency details — team size, registration number, certificate, and services provided',
            },
          ]}
          caption="Commit a contract, track placements, carry a verified agency profile."
        />
      </Section>

      <Section id="support" label="Support workers" tocLabel="Support workers">
        <Prose>
          <Text>
            Cleaners, drivers and hygiene staff get the lightest path: a phone
            number, an OTP, and only what matching needs. Home meets them in
            WhatsApp job groups, and verification asks for one photo ID.
          </Text>
        </Prose>
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/support-register-phone.jpg',
              alt: 'Register with phone number — a single phone field with send OTP',
            },
            {
              src: '/works/blubees/support-otp.jpg',
              alt: 'Enter OTP — four-digit code entry with resend',
            },
            {
              src: '/works/blubees/support-details.jpg',
              alt: 'Tell us about you — name, pincode, service picker, and a request-call-to-register fallback',
            },
          ]}
          caption="Phone → OTP → the few details matching needs."
        />
        <PhoneScene
          screens={[
            {
              src: '/works/blubees/other-worker-home.jpg',
              alt: 'Support-worker home — WhatsApp job groups to join and location-matched jobs',
            },
            {
              src: '/works/blubees/support-profile.jpg',
              alt: 'Support-worker profile — phone number and an Aadhaar photo ID',
            },
          ]}
          caption="WhatsApp groups and location matching; a photo ID is all verification asks."
        />
      </Section>

      <Section id="close" label="What held it together" tocLabel="Reflection" className="lg:mt-40">
        <Prose>
          <Points>
            <Point lead="Symmetry.">
              Four personas, one marketplace, every flow twice. Shared anatomy
              kept a three-sided product from feeling like three products.
            </Point>
            <Point lead="Trust.">
              Verification and two-way ratings are what let a hospital hand
              tomorrow&apos;s shift to someone it has never met.
            </Point>
          </Points>
        </Prose>
      </Section>
    </>
  )
}
