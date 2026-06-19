/**
 * Public SMS opt-in flow documentation page.
 *
 * Required by Twilio A2P 10DLC reviewers as the publicly-accessible
 * URL where they can verify the consent experience for Momentify's
 * SMS messaging program. Linked from the campaign's message_flow
 * description. Mirrors the structure Twilio's "Offline or paper
 * opt-in" example uses (URL hosting consent evidence) since
 * Momentify's opt-in happens in-person at staffed event kiosks
 * rather than on a single fixed marketing URL.
 *
 * Keep this page reachable WITHOUT login. Twilio reviewers visit
 * cold during campaign review and re-review.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMS Opt-in Flow | Momentify",
  description:
    "How attendees consent to receive SMS messages from Momentify at in-person event kiosks. Disclosure language, opt-in mechanism, opt-out, and links to privacy and terms.",
  alternates: {
    canonical: "https://momentifyapp.com/sms-opt-in-flow",
  },
  robots: {
    // Reviewable but not indexed — this is a compliance page, not
    // marketing content, and shouldn't compete with /privacy for SEO.
    index: false,
    follow: true,
  },
};

const DEEP_NAVY = "#0a1238";
const TEAL = "#00BBA5";
const BODY = "#1f2533";

export default function SmsOptInFlowPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px", fontFamily: "var(--font-inter), -apple-system, sans-serif", color: BODY, lineHeight: 1.7 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: TEAL, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
        Compliance · SMS Messaging
      </p>
      <h1 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: 32, color: DEEP_NAVY, letterSpacing: "-0.02em", marginBottom: 24 }}>
        SMS Opt-in Flow
      </h1>
      <p style={{ fontSize: 16, marginBottom: 32 }}>
        Momentify is a B2B event-engagement platform operated by ENTEVATE, INC. Attendees of in-person events
        (recruiting fairs, trade shows, dealer events, athletic franchises) opt in to receive SMS messages by
        entering their mobile phone number at a staffed Momentify-equipped tablet or touchscreen kiosk at the
        event venue. This page documents that consent flow for end-users and for SMS provider review.
      </p>

      <h2 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: 22, color: DEEP_NAVY, marginTop: 40, marginBottom: 16 }}>
        Step-by-step consent flow
      </h2>
      <ol style={{ paddingLeft: 22, marginBottom: 32 }}>
        <li style={{ marginBottom: 12 }}>
          An attendee voluntarily approaches a Momentify-equipped tablet or touchscreen kiosk staffed by
          the event organizer (the &quot;B2B customer&quot; on whose behalf Momentify sends messages).
        </li>
        <li style={{ marginBottom: 12 }}>
          The attendee taps a phone number field on the kiosk and types their own U.S. mobile number.
          No phone numbers are imported from third-party lists, purchased databases, or any external
          source. Each attendee individually enters their own number.
        </li>
        <li style={{ marginBottom: 12 }}>
          Beneath the phone number field, the kiosk displays the SMS consent disclosure (full text below).
          A &quot;Continue&quot; button sits below the disclosure — it is <strong>not</strong> pre-selected
          or pre-checked. The attendee must actively tap &quot;Continue&quot; for the opt-in to register.
        </li>
        <li style={{ marginBottom: 12 }}>
          On tap, the attendee&apos;s phone number is recorded as an explicit SMS opt-in, scoped to the
          specific event and event organizer. The kiosk proceeds to the next step (typically content
          selection or the event experience flow).
        </li>
        <li style={{ marginBottom: 12 }}>
          The attendee&apos;s first SMS is a welcome / confirmation message restating who is sending the
          messages, the opt-in context, message frequency, message-and-data-rates language, and the
          STOP / HELP keywords.
        </li>
        <li style={{ marginBottom: 12 }}>
          Subsequent SMS messages deliver the event-related content the attendee requested at the kiosk —
          recruiting documents, training program materials, photo galleries, session follow-ups, or
          event-organizer next-step communications.
        </li>
      </ol>

      <h2 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: 22, color: DEEP_NAVY, marginTop: 40, marginBottom: 16 }}>
        Consent disclosure shown on the kiosk
      </h2>
      <p style={{ fontSize: 16, marginBottom: 16 }}>
        Verbatim text displayed under the phone number field on every Momentify kiosk before the attendee
        taps Continue:
      </p>
      <blockquote style={{ borderLeft: `3px solid ${TEAL}`, paddingLeft: 20, margin: "0 0 32px", fontSize: 16, color: DEEP_NAVY }}>
        By tapping Continue, you agree to receive event-related text messages from [Event Organizer] via
        Momentify. Message frequency varies. Message and data rates may apply. Reply STOP to opt out,
        HELP for help. See <a href="https://momentifyapp.com/privacy" style={{ color: TEAL, textDecoration: "underline" }}>https://momentifyapp.com/privacy</a> for details.
      </blockquote>

      <h2 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: 22, color: DEEP_NAVY, marginTop: 40, marginBottom: 16 }}>
        Welcome / confirmation message
      </h2>
      <p style={{ fontSize: 16, marginBottom: 16 }}>
        The first SMS message sent to a newly opted-in phone number:
      </p>
      <blockquote style={{ borderLeft: `3px solid ${TEAL}`, paddingLeft: 20, margin: "0 0 32px", fontSize: 16, color: DEEP_NAVY }}>
        Welcome to Momentify. You opted in at the [Event Organizer] kiosk to receive your requested event
        content. Msg &amp; data rates may apply. Msg frequency varies. Reply STOP to opt out, HELP for help.
      </blockquote>

      <h2 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: 22, color: DEEP_NAVY, marginTop: 40, marginBottom: 16 }}>
        Opt-out (STOP)
      </h2>
      <p style={{ fontSize: 16, marginBottom: 32 }}>
        Recipients may opt out at any time by replying <strong>STOP</strong> (or the carrier-recognized
        variants STOPALL, UNSUBSCRIBE, CANCEL, END, QUIT) to any message. Twilio&apos;s Messaging Service
        layer handles opt-out enforcement automatically: once a recipient sends STOP, no further messages
        will be delivered to that number from this Messaging Service. The auto-reply is:
      </p>
      <blockquote style={{ borderLeft: `3px solid ${TEAL}`, paddingLeft: 20, margin: "0 0 32px", fontSize: 16, color: DEEP_NAVY }}>
        You have been unsubscribed from Momentify event messages. No further messages will be sent. Reply
        START to resubscribe at any time.
      </blockquote>

      <h2 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: 22, color: DEEP_NAVY, marginTop: 40, marginBottom: 16 }}>
        Help (HELP)
      </h2>
      <p style={{ fontSize: 16, marginBottom: 16 }}>
        Recipients may request help at any time by replying <strong>HELP</strong> or INFO. The auto-reply
        is:
      </p>
      <blockquote style={{ borderLeft: `3px solid ${TEAL}`, paddingLeft: 20, margin: "0 0 32px", fontSize: 16, color: DEEP_NAVY }}>
        Momentify event messaging — help: visit <a href="https://momentifyapp.com/contact" style={{ color: TEAL, textDecoration: "underline" }}>https://momentifyapp.com/contact</a> or email
        hello@momentifyapp.com. Msg &amp; data rates may apply. Reply STOP to opt out.
      </blockquote>

      <h2 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: 22, color: DEEP_NAVY, marginTop: 40, marginBottom: 16 }}>
        Message frequency
      </h2>
      <p style={{ fontSize: 16, marginBottom: 32 }}>
        Low. Typically 1–4 messages over a 7-day window per single event opt-in. Frequency varies by the
        attendee&apos;s level of event participation.
      </p>

      <h2 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: 22, color: DEEP_NAVY, marginTop: 40, marginBottom: 16 }}>
        Data handling
      </h2>
      <p style={{ fontSize: 16, marginBottom: 16 }}>
        ENTEVATE, INC. (operating Momentify) does not share or sell mobile phone numbers or SMS opt-in
        consent with any third party for marketing, promotional, or third-party advertising purposes.
        Opt-in consent collected for SMS is used solely to deliver the messages the attendee requested
        and is never transferred to affiliates, partners, or other parties for their own marketing. See
        the SMS / Text Messaging section of the {" "}
        <a href="https://momentifyapp.com/privacy" style={{ color: TEAL, textDecoration: "underline" }}>Privacy Policy</a>{" "}
        for the full disclosure.
      </p>

      <h2 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: 22, color: DEEP_NAVY, marginTop: 40, marginBottom: 16 }}>
        Legal
      </h2>
      <ul style={{ paddingLeft: 22, marginBottom: 32 }}>
        <li style={{ marginBottom: 8 }}>
          <a href="https://momentifyapp.com/privacy" style={{ color: TEAL, textDecoration: "underline" }}>Privacy Policy</a>{" "}
          — including the SMS / Text Messaging section
        </li>
        <li style={{ marginBottom: 8 }}>
          <a href="https://momentifyapp.com/terms" style={{ color: TEAL, textDecoration: "underline" }}>Terms of Service</a>
        </li>
        <li style={{ marginBottom: 8 }}>
          <a href="https://momentifyapp.com/contact" style={{ color: TEAL, textDecoration: "underline" }}>Contact</a>
          {" "}— for SMS support questions and opt-out assistance
        </li>
      </ul>

      <p style={{ fontSize: 14, color: "#5a6175", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        ENTEVATE, INC. operating the platform &quot;Momentify&quot;. Last updated 2026.
      </p>
    </main>
  );
}
