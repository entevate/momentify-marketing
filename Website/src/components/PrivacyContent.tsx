"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const DEEP_NAVY = "#061341";
const BODY_COLOR = "rgba(6,19,65,0.65)";
const TEAL = "#00BBA5";
const mainMinimal = "linear-gradient(135deg, #7C316D 0%, #0B0B3C 55%, #1A2E73 100%)";

const MainMinimalOverlay = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full"
    viewBox="0 0 600 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMaxYMax slice"
    aria-hidden="true"
  >
    <path d="M600 500 L600 180 L420 0 L220 0 L440 220 L440 500 Z" fill="white" fillOpacity="0.05" />
    <path d="M600 500 L600 300 L380 80 L180 80 L380 280 L380 500 Z" fill="white" fillOpacity="0.04" />
  </svg>
);

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: "48px" }}>
      <h2 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "22px", color: DEEP_NAVY, marginBottom: "20px" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "15px", color: BODY_COLOR, lineHeight: 1.7, marginBottom: "16px" }}>
      {children}
    </p>
  );
}

function SubHead({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "18px", color: DEEP_NAVY, marginBottom: "12px", marginTop: "28px" }}>
      {children}
    </h3>
  );
}

function BulletList({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ul style={{ marginBottom: "16px", paddingLeft: "0" }}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5" style={{ marginBottom: "8px" }}>
          <span className="mt-[8px] h-[5px] w-[5px] rounded-full flex-shrink-0" style={{ backgroundColor: TEAL }} />
          <span style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "15px", color: BODY_COLOR, lineHeight: 1.7 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyContent() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden"
          style={{
            backgroundSize: "200% 200%",
            animation: "bgShift 16s ease-in-out infinite",
            backgroundImage: mainMinimal,
            minHeight: "440px",
          }}
        >
          <MainMinimalOverlay />
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.06] blur-[120px]" style={{ background: "radial-gradient(circle, #3A2073, transparent 70%)", top: "10%", left: "55%", animation: "ambientFloat1 12s ease-in-out infinite" }} />
            <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[100px]" style={{ background: "radial-gradient(circle, #00BBA5, transparent 70%)", bottom: "0%", left: "10%", animation: "ambientFloat2 15s ease-in-out infinite" }} />
            <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[80px]" style={{ background: "radial-gradient(circle, #1A56DB, transparent 70%)", top: "40%", right: "5%", animation: "ambientFloat3 18s ease-in-out infinite" }} />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 flex items-center" style={{ minHeight: "440px" }}>
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "11px", color: TEAL, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: "16px" }}
              >
                Legal
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18 }}
                className="leading-[1.05]"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "clamp(34px, 5vw, 52px)", color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "24px" }}
              >
                Privacy Policy
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 }}
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(255, 255, 255, 0.55)", lineHeight: 1.5, maxWidth: "680px" }}
              >
                How ENTEVATE, INC. collects, uses, and protects your information when you use the Momentify platform and services. Last updated August 14, 2024.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section style={{ padding: "80px 0" }}>
          <div className="mx-auto max-w-4xl px-6 lg:px-12">
            <P>
              This Privacy Notice for ENTEVATE, INC. (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), describes how and
              why we might collect, store, use, and/or share (&quot;process&quot;) your information when you use our services
              (&quot;Services&quot;), such as when you visit our website at{" "}
              <a href="https://www.momentifyapp.com" className="underline hover:opacity-70" style={{ color: TEAL }}>https://www.momentifyapp.com</a>,
              or any website of ours that links to this Privacy Notice, download and use our mobile application (Momentify),
              or engage with us in other related ways, including any sales, marketing, or events.
            </P>
            <P>
              Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices.
              If you do not agree with our policies and practices, please do not use our Services. If you still have any
              questions or concerns, please contact us at{" "}
              <a href="mailto:hello@entevate.com" className="underline hover:opacity-70" style={{ color: TEAL }}>hello@entevate.com</a>.
            </P>

            {/* Summary of Key Points */}
            <div style={{ background: "#F8F9FC", borderRadius: "16px", padding: "32px", marginBottom: "48px", border: "1px solid rgba(6,19,65,0.08)" }}>
              <h2 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "20px", color: DEEP_NAVY, marginBottom: "16px" }}>
                Summary of Key Points
              </h2>
              <P>
                <strong>What personal information do we process?</strong> When you visit, use, or navigate our Services,
                we may process personal information depending on how you interact with us and the Services, the choices you
                make, and the products and features you use.
              </P>
              <P>
                <strong>Do we process any sensitive personal information?</strong> We do not process sensitive personal information.
              </P>
              <P>
                <strong>Do we collect any information from third parties?</strong> We do not collect any information from third parties.
              </P>
              <P>
                <strong>How do we process your information?</strong> We process your information to provide, improve, and
                administer our Services, communicate with you, for security and fraud prevention, and to comply with law.
                We may also process your information for other purposes with your consent.
              </P>
              <P>
                <strong>In what situations and with which parties do we share personal information?</strong> We may share
                information in specific situations and with specific third parties.
              </P>
              <P>
                <strong>How do we keep your information safe?</strong> We have adequate organizational and technical processes
                and procedures in place to protect your personal information. However, no electronic transmission over the
                internet or information storage technology can be guaranteed to be 100% secure.
              </P>
              <P>
                <strong>What are your rights?</strong> Depending on where you are located geographically, the applicable
                privacy law may mean you have certain rights regarding your personal information.
              </P>
              <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "15px", color: BODY_COLOR, lineHeight: 1.7 }}>
                <strong>How do you exercise your rights?</strong> The easiest way to exercise your rights is by submitting
                a data subject access request, or by contacting us. We will consider and act upon any request in accordance
                with applicable data protection laws.
              </p>
            </div>

            {/* 1 */}
            <Section id="information-collected" title="1. What Information Do We Collect?">
              <SubHead>Personal information you disclose to us</SubHead>
              <P>
                We collect personal information that you voluntarily provide to us when you register on the Services,
                express an interest in obtaining information about us or our products and Services, when you participate
                in activities on the Services, or otherwise when you contact us.
              </P>
              <P>
                <strong>Personal Information Provided by You.</strong> The personal information that we collect depends on
                the context of your interactions with us and the Services, the choices you make, and the products and
                features you use. The personal information we collect may include the following:
              </P>
              <BulletList items={[
                "Names",
                "Phone numbers",
                "Email addresses",
                "Job titles",
                "Contact preferences",
                "Passwords",
                "Company name",
              ]} />
              <P>
                <strong>Sensitive Information.</strong> We do not process sensitive information.
              </P>

              <SubHead>Application Data</SubHead>
              <P>
                If you use our application(s), we also may collect the following information if you choose to provide us
                with access or permission:
              </P>
              <P>
                <strong>Geolocation Information.</strong> We may request access or permission to track location-based
                information from your mobile device, either continuously or while you are using our mobile application(s),
                to provide certain location-based services. If you wish to change our access or permissions, you may do so
                in your device&apos;s settings.
              </P>
              <P>
                <strong>Mobile Device Access.</strong> We may request access or permission to certain features from your
                mobile device, including your mobile device&apos;s camera, microphone, and other features. If you wish to
                change our access or permissions, you may do so in your device&apos;s settings.
              </P>
              <P>
                <strong>Push Notifications.</strong> We may request to send you push notifications regarding your account or
                certain features of the application(s). If you wish to opt out from receiving these types of communications,
                you may turn them off in your device&apos;s settings.
              </P>
              <P>
                <strong>SMS / Text Messaging.</strong> When you participate in a Momentify-equipped event, you may
                voluntarily provide your mobile phone number at a staffed kiosk or via an opt-in form to receive
                event-related text messages. These messages may include session content, requested documents, confirmation
                of activities, and follow-up communications from the event organizer. Message frequency varies by event
                participation and is generally low. Standard message and data rates may apply per your wireless carrier
                agreement. To stop receiving messages at any time, reply <strong>STOP</strong> to any message; for
                assistance, reply <strong>HELP</strong>.
                {" "}
                <strong>
                  We do not share or sell mobile phone numbers or SMS opt-in consent with any third party for marketing
                  or promotional purposes.
                </strong>
                {" "}
                Mobile information is used solely to deliver the messages you opted in to receive and to maintain service
                quality. Opt-in consent collected for SMS is never transferred to affiliates, partners, or other third
                parties for their own marketing.
              </P>
              <P>
                This information is primarily needed to maintain the security and operation of our application(s), for
                troubleshooting, and for our internal analytics and reporting purposes. All personal information that you
                provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal
                information.
              </P>

              <SubHead>Information automatically collected</SubHead>
              <P>
                We automatically collect certain information when you visit, use, or navigate the Services. This information
                does not reveal your specific identity (like your name or contact information) but may include device and
                usage information, such as your IP address, browser and device characteristics, operating system, language
                preferences, referring URLs, device name, country, location, information about how and when you use our
                Services, and other technical information. This information is primarily needed to maintain the security and
                operation of our Services, and for our internal analytics and reporting purposes.
              </P>
              <P>
                Like many businesses, we also collect information through cookies and similar technologies. The information
                we collect includes:
              </P>
              <P>
                <strong>Log and Usage Data.</strong> Log and usage data is service-related, diagnostic, usage, and performance
                information our servers automatically collect when you access or use our Services and which we record in log
                files. Depending on how you interact with us, this log data may include your IP address, device information,
                browser type, and settings and information about your activity in the Services (such as the date/time stamps
                associated with your usage, pages and files viewed, searches, and other actions you take such as which
                features you use), device event information (such as system activity, error reports, and hardware settings).
              </P>
              <P>
                <strong>Device Data.</strong> We collect device data such as information about your computer, phone, tablet,
                or other device you use to access the Services. Depending on the device used, this device data may include
                information such as your IP address (or proxy server), device and application identification numbers,
                location, browser type, hardware model, Internet service provider and/or mobile carrier, operating system,
                and system configuration information.
              </P>
              <P>
                <strong>Location Data.</strong> We collect location data such as information about your device&apos;s
                location, which can be either precise or imprecise. How much information we collect depends on the type and
                settings of the device you use to access the Services. For example, we may use GPS and other technologies to
                collect geolocation data that tells us your current location (based on your IP address). You can opt out of
                allowing us to collect this information either by refusing access to the information or by disabling your
                Location setting on your device. However, if you choose to opt out, you may not be able to use certain
                aspects of the Services.
              </P>
              <P>
                <strong>Google API.</strong> Our use of information received from Google APIs will adhere to Google API
                Services User Data Policy, including the Limited Use requirements.
              </P>
            </Section>

            {/* 2 */}
            <Section id="how-we-process" title="2. How Do We Process Your Information?">
              <P>
                We process your personal information for a variety of reasons, depending on how you interact with our
                Services, including:
              </P>
              <BulletList items={[
                <><strong>To facilitate account creation and authentication and otherwise manage user accounts.</strong> We may process your information so you can create and log in to your account, as well as keep your account in working order.</>,
                <><strong>To deliver and facilitate delivery of services to the user.</strong> We may process your information to provide you with the requested service.</>,
                <><strong>To respond to user inquiries/offer support to users.</strong> We may process your information to respond to your inquiries and solve any potential issues you might have with the requested service.</>,
                <><strong>To request feedback.</strong> We may process your information when necessary to request feedback and to contact you about your use of our Services.</>,
                <><strong>To identify usage trends.</strong> We may process information about how you use our Services to better understand how they are being used so we can improve them.</>,
                <><strong>To save or protect an individual&apos;s vital interest.</strong> We may process your information when necessary to save or protect an individual&apos;s vital interest, such as to prevent harm.</>,
              ]} />
            </Section>

            {/* 3 */}
            <Section id="legal-bases" title="3. What Legal Bases Do We Rely On to Process Your Information?">
              <P>
                We only process your personal information when we believe it is necessary and we have a valid legal reason
                (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide
                you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill
                our legitimate business interests.
              </P>

              <SubHead>If you are located in the EU or UK, this section applies to you.</SubHead>
              <P>
                The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we
                rely on in order to process your personal information. As such, we may rely on the following legal bases:
              </P>
              <BulletList items={[
                <><strong>Consent.</strong> We may process your information if you have given us permission (i.e., consent) to use your personal information for a specific purpose. You can withdraw your consent at any time.</>,
                <><strong>Performance of a Contract.</strong> We may process your personal information when we believe it is necessary to fulfill our contractual obligations to you, including providing our Services or at your request prior to entering into a contract with you.</>,
                <><strong>Legitimate Interests.</strong> We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests and those interests do not outweigh your interests and fundamental rights and freedoms.</>,
                <><strong>Legal Obligations.</strong> We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.</>,
                <><strong>Vital Interests.</strong> We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.</>,
              ]} />

              <SubHead>If you are located in Canada, this section applies to you.</SubHead>
              <P>
                We may process your information if you have given us specific permission (i.e., express consent) to use your
                personal information for a specific purpose, or in situations where your permission can be inferred (i.e.,
                implied consent). You can withdraw your consent at any time.
              </P>
              <P>
                In some exceptional cases, we may be legally permitted under applicable law to process your information
                without your consent, including, for example:
              </P>
              <BulletList items={[
                "If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way",
                "For investigations and fraud detection and prevention",
                "For business transactions provided certain conditions are met",
                "If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim",
                "For identifying injured, ill, or deceased persons and communicating with next of kin",
                "If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse",
                "If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province",
                "If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records",
                "If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced",
                "If the collection is solely for journalistic, artistic, or literary purposes",
                "If the information is publicly available and is specified by the regulations",
              ]} />
            </Section>

            {/* 4 */}
            <Section id="share-information" title="4. When and With Whom Do We Share Your Personal Information?">
              <P>
                We may need to share your personal information in the following situations:
              </P>
              <BulletList items={[
                <><strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</>,
                <><strong>When we use Google Maps Platform APIs.</strong> We may share your information with certain Google Maps Platform APIs (e.g., Google Maps API, Places API). Google Maps uses GPS, Wi-Fi, and cell towers to estimate your location. GPS is accurate to about 20 meters, while Wi-Fi and cell towers help improve accuracy when GPS signals are weak, like indoors. This data helps Google Maps provide directions, but it is not always perfectly precise.</>,
                <><strong>Affiliates.</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Notice. Affiliates include our parent company and any subsidiaries, joint venture partners, or other companies that we control or that are under common control with us.</>,
              ]} />
            </Section>

            {/* 5 */}
            <Section id="cookies-tracking" title="5. Do We Use Cookies and Other Tracking Technologies?">
              <P>
                We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when
                you interact with our Services. Some online tracking technologies help us maintain the security of our
                Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site
                functions.
              </P>
              <P>
                We also permit third parties and service providers to use online tracking technologies on our Services for
                analytics and advertising, including to help manage and display advertisements, to tailor advertisements to
                your interests, or to send abandoned shopping cart reminders (depending on your communication preferences).
                The third parties and service providers use their technology to provide advertising about products and
                services tailored to your interests which may appear either on our Services or on other websites.
              </P>
              <P>
                To the extent these online tracking technologies are deemed to be a &quot;sale&quot;/&quot;sharing&quot;
                (which includes targeted advertising, as defined under the applicable laws) under applicable US state laws,
                you can opt out of these online tracking technologies by submitting a request as described below under
                section &quot;Do United States Residents Have Specific Privacy Rights?&quot;
              </P>
              <SubHead>Google Analytics</SubHead>
              <P>
                We may share your information with Google Analytics to track and analyze the use of the Services. To opt out
                of being tracked by Google Analytics across the Services, visit{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" className="underline hover:opacity-70" style={{ color: TEAL }} target="_blank" rel="noopener noreferrer">
                  https://tools.google.com/dlpage/gaoptout
                </a>. For more information on the privacy practices of Google, please visit the Google Privacy &amp; Terms page.
              </P>
            </Section>

            {/* 6 */}
            <Section id="data-retention" title="6. How Long Do We Keep Your Information?">
              <P>
                We will only keep your personal information for as long as it is necessary for the purposes set out in this
                Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting,
                or other legal requirements). No purpose in this notice will require us keeping your personal information
                for longer than the period of time in which users have an account with us.
              </P>
              <P>
                When we have no ongoing legitimate business need to process your personal information, we will either delete
                or anonymize such information, or, if this is not possible (for example, because your personal information
                has been stored in backup archives), then we will securely store your personal information and isolate it
                from any further processing until deletion is possible.
              </P>
            </Section>

            {/* 7 */}
            <Section id="information-safe" title="7. How Do We Keep Your Information Safe?">
              <P>
                We have implemented appropriate and reasonable technical and organizational security measures designed to
                protect the security of any personal information we process. However, despite our safeguards and efforts to
                secure your information, no electronic transmission over the Internet or information storage technology can
                be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other
                unauthorized third parties will not be able to defeat our security and improperly collect, access, steal,
                or modify your information. Although we will do our best to protect your personal information, transmission
                of personal information to and from our Services is at your own risk. You should only access the Services
                within a secure environment.
              </P>
            </Section>

            {/* 8 */}
            <Section id="minors" title="8. Do We Collect Information from Minors?">
              <P>
                We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we
                knowingly sell such personal information. By using the Services, you represent that you are at least 18 or
                that you are the parent or guardian of such a minor and consent to such minor dependent&apos;s use of the
                Services. If we learn that personal information from users less than 18 years of age has been collected, we
                will deactivate the account and take reasonable measures to promptly delete such data from our records. If
                you become aware of any data we may have collected from children under age 18, please contact us at{" "}
                <a href="mailto:hello@entevate.com" className="underline hover:opacity-70" style={{ color: TEAL }}>hello@entevate.com</a>.
              </P>
            </Section>

            {/* 9 */}
            <Section id="privacy-rights" title="9. What Are Your Privacy Rights?">
              <P>
                In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data
                protection laws. These may include the right (i) to request access and obtain a copy of your personal
                information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal
                information; (iv) if applicable, to data portability; and (v) not to be subject to automated
                decision-making. In certain circumstances, you may also have the right to object to the processing of your
                personal information.
              </P>
              <P>
                If you are a resident in the European Economic Area and you believe we are unlawfully processing your personal
                information, you also have the right to complain to your Member State data protection authority or UK data
                protection authority.
              </P>
              <P>
                If you are a resident in Switzerland, you may contact the Federal Data Protection and Information Commissioner.
              </P>
              <P>
                <strong>Withdrawing your consent:</strong> If we are relying on your consent to process your personal
                information, you have the right to withdraw your consent at any time. You can withdraw your consent at any
                time by contacting us using the contact details provided in the section &quot;How Can You Contact Us About
                This Notice?&quot; below. However, please note that this will not affect the lawfulness of the processing
                before its withdrawal nor will it affect the processing of your personal information conducted in reliance
                on lawful processing grounds other than consent.
              </P>
              <P>
                <strong>Opting out of marketing and promotional communications:</strong> You can unsubscribe from our
                marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that
                we send, or by contacting us using the details provided in the section &quot;How Can You Contact Us About
                This Notice?&quot; below. You will then be removed from the marketing lists. However, we may still
                communicate with you, for example to send you service-related messages that are necessary for the
                administration and use of your account, to respond to service requests, or for other non-marketing purposes.
              </P>

              <SubHead>Account Information</SubHead>
              <P>
                If you would at any time like to review or change the information in your account or terminate your account,
                you can log in to your account settings and update your user account, or contact us using the contact
                information provided. Upon your request to terminate your account, we will deactivate or delete your account
                and information from our active databases. However, we may retain some information in our files to prevent
                fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with
                applicable legal requirements.
              </P>
              <P>
                <strong>Cookies and similar technologies:</strong> Most web browsers are set to accept cookies by default.
                If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you
                choose to remove cookies or reject cookies, this could affect certain features or services of our Services.
              </P>
            </Section>

            {/* 10 */}
            <Section id="do-not-track" title="10. Controls for Do-Not-Track Features">
              <P>
                Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track
                (&quot;DNT&quot;) feature or setting you can activate to signal your privacy preference not to have data
                about your online browsing activities monitored and collected. At this stage no uniform technology standard
                for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT
                browser signals or any other mechanism that automatically communicates your choice not to be tracked online.
                If a standard for online tracking is adopted that we must follow in the future, we will inform you about
                that practice in a revised version of this Privacy Notice.
              </P>
            </Section>

            {/* 11 */}
            <Section id="us-residents" title="11. Do United States Residents Have Specific Privacy Rights?">
              <P>
                If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky,
                Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Tennessee, Texas, Utah, or Virginia, you
                may have the right to request access to and receive details about the personal information we maintain about
                you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information.
                You may also have the right to withdraw your consent to our processing of your personal information. These
                rights may be limited in some circumstances by applicable law.
              </P>

              <SubHead>Categories of Personal Information We Collect</SubHead>
              <P>
                We have collected the following categories of personal information in the past twelve (12) months:
              </P>
              <div style={{ overflowX: "auto", marginBottom: "24px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-inter)", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(6,19,65,0.15)" }}>
                      <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 500, color: DEEP_NAVY }}>Category</th>
                      <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 500, color: DEEP_NAVY }}>Examples</th>
                      <th style={{ textAlign: "center", padding: "12px 16px", fontWeight: 500, color: DEEP_NAVY }}>Collected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cat: "A. Identifiers", ex: "Contact details such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, IP address, email address, and account name", col: "YES" },
                      { cat: "B. Personal information per California Customer Records statute", ex: "Name, contact information, education, employment, employment history, and financial information", col: "NO" },
                      { cat: "C. Protected classification characteristics", ex: "Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data", col: "NO" },
                      { cat: "D. Commercial information", ex: "Transaction information, purchase history, financial details, and payment information", col: "NO" },
                      { cat: "E. Biometric information", ex: "Fingerprints and voiceprints", col: "NO" },
                      { cat: "F. Internet or other similar network activity", ex: "Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements", col: "NO" },
                      { cat: "G. Geolocation data", ex: "Device location", col: "NO" },
                      { cat: "H. Audio, electronic, sensory, or similar information", ex: "Images and audio, video or call recordings created in connection with our business activities", col: "NO" },
                      { cat: "I. Professional or employment-related information", ex: "Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications", col: "YES" },
                      { cat: "J. Education information", ex: "Student records and directory information", col: "NO" },
                      { cat: "K. Inferences drawn from collected personal information", ex: "Inferences drawn from any of the collected personal information listed above to create a profile or summary", col: "NO" },
                      { cat: "L. Sensitive personal information", ex: "N/A", col: "NO" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(6,19,65,0.08)", background: i % 2 === 0 ? "#F8F9FC" : "#FFFFFF" }}>
                        <td style={{ padding: "12px 16px", color: DEEP_NAVY, fontWeight: 500, verticalAlign: "top", minWidth: "200px" }}>{row.cat}</td>
                        <td style={{ padding: "12px 16px", color: BODY_COLOR, verticalAlign: "top" }}>{row.ex}</td>
                        <td style={{ padding: "12px 16px", color: row.col === "YES" ? "#1B7A3D" : BODY_COLOR, fontWeight: 500, textAlign: "center", verticalAlign: "top" }}>{row.col}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <P>
                We may also collect other personal information outside of these categories through instances where you
                interact with us in person, online, or by phone or mail in the context of receiving help through our
                customer support channels, participation in customer surveys or contests, and facilitation in the delivery
                of our Services and to respond to your inquiries.
              </P>
              <P>
                We have not sold personal information in the preceding twelve (12) months.
              </P>

              <SubHead>Your Rights</SubHead>
              <P>
                You have rights under certain US state data protection laws. However, these rights are not absolute, and in
                certain cases, we may decline your request as permitted by law. These rights include:
              </P>
              <BulletList items={[
                "Right to know whether or not we are processing your personal data",
                "Right to access your personal data",
                "Right to correct inaccuracies in your personal data",
                "Right to request the deletion of your personal data",
                "Right to obtain a copy of the personal data you previously shared with us",
                "Right to non-discrimination for exercising your rights",
                "Right to opt out of the processing of your personal data if it is used for targeted advertising (or sharing as defined under California's privacy law), the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects",
              ]} />

              <SubHead>How to Exercise Your Rights</SubHead>
              <P>
                To exercise these rights, you can contact us by submitting a data subject access request, by emailing us at{" "}
                <a href="mailto:hello@entevate.com" className="underline hover:opacity-70" style={{ color: TEAL }}>hello@entevate.com</a>,
                or by referring to the contact details at the bottom of this document.
              </P>
              <P>
                Under certain US state data protection laws, you can designate an authorized agent to make a request on your
                behalf. We may deny a request from an authorized agent that does not submit proof that they have been validly
                authorized to act on your behalf in accordance with applicable laws.
              </P>

              <SubHead>Request Verification</SubHead>
              <P>
                Upon receiving your request, we will need to verify your identity to determine you are the same person about
                whom we have the information in our system. We will only use personal information provided in your request to
                verify your identity or authority to make the request.
              </P>

              <SubHead>Appeals</SubHead>
              <P>
                Under certain US state data protection laws, if we decline to take action regarding your request, you may
                appeal our decision by emailing us at{" "}
                <a href="mailto:hello@entevate.com" className="underline hover:opacity-70" style={{ color: TEAL }}>hello@entevate.com</a>.
                We will inform you in writing of any action taken or not taken in response to the appeal, including a written
                explanation of the reasons for the decisions. If your appeal is denied, you may contact your state attorney
                general to submit a complaint.
              </P>

              <SubHead>California &quot;Shine The Light&quot; Law</SubHead>
              <P>
                California Civil Code Section 1798.83, also known as the &quot;Shine The Light&quot; law, permits our users
                who are California residents to request and obtain from us, once a year and free of charge, information about
                categories of personal information (if any) we disclosed to third parties for direct marketing purposes and
                the names and addresses of all third parties with which we shared personal information in the immediately
                preceding calendar year. If you are a California resident and would like to make such a request, please
                submit your request in writing to us using the contact information provided below.
              </P>
            </Section>

            {/* 12 */}
            <Section id="updates" title="12. Do We Make Updates to This Notice?">
              <P>
                We may update this Privacy Notice from time to time. The updated version will be indicated by an updated
                &quot;Revised&quot; date at the top of this Privacy Notice. If we make material changes to this Privacy
                Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you
                a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are
                protecting your information.
              </P>
            </Section>

            {/* 13 */}
            <Section id="contact-us" title="13. How Can You Contact Us About This Notice?">
              <P>
                If you have questions or comments about this notice, you may email us at{" "}
                <a href="mailto:hello@entevate.com" className="underline hover:opacity-70" style={{ color: TEAL }}>hello@entevate.com</a>{" "}
                or contact us by post at:
              </P>
              <div style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "15px", color: BODY_COLOR, lineHeight: 1.7 }}>
                <p style={{ marginBottom: "4px" }}><strong>ENTEVATE, INC.</strong></p>
                <p style={{ marginBottom: "4px" }}>5 Cowboys Way, Suite 300</p>
                <p style={{ marginBottom: "4px" }}>Frisco, TX 75034</p>
                <p>United States</p>
              </div>
            </Section>

            {/* 14 */}
            <Section id="review-data" title="14. How Can You Review, Update, or Delete the Data We Collect from You?">
              <P>
                Based on the applicable laws of your country or state of residence in the US, you may have the right to
                request access to the personal information we collect from you, details about how we have processed it,
                correct inaccuracies, or delete your personal information. You may also have the right to withdraw your
                consent to our processing of your personal information. These rights may be limited in some circumstances by
                applicable law. To request to review, update, or delete your personal information, please submit a data
                subject access request.
              </P>
            </Section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
