// Interview Config: Mustang Cat Technician Open Interview (tablet)
//
// Authored against the new `interview` template kind. Source prototype:
// ~/Development/Momentify/Brand/mustangcat-interview.html — colors and
// copy are translated 1:1 from the prototype's inline CSS and step DOM.

import type { InterviewConfig } from '../types';

export const MUSTANGCAT_INTERVIEW_CONFIG: InterviewConfig = {
  id: 'mustangcat-interview',
  name: 'Mustang Cat Technician Open Interview',
  version: 1,
  createdAt: '2026-05-14T00:00:00.000Z',
  updatedAt: '2026-05-14T00:00:00.000Z',
  // Phase 12 — formFactor removed from template config. Form factor
  // is now picked at moment-creation time in Momentify Web and stamped
  // onto moments.formFactor. The runtime injects it back into the
  // rendered config blob so the shells still read config.formFactor.

  branding: {
    logo: '/logos/mustang-cat-color.png',
    primary: '#FFCC00',
    textOnPrimary: '#000000',
    bg: '#0a0a0a',
    surface: 'rgba(255,255,255,0.06)',
    surfaceHover: 'rgba(255,255,255,0.10)',
    border: 'rgba(255,255,255,0.12)',
    text1: '#FFFFFF',
    text2: 'rgba(255,255,255,0.75)',
    text3: 'rgba(255,255,255,0.50)',
    gradient: 'linear-gradient(135deg, #FFCC00 0%, #FFA500 100%)',
    bgImage: '/brand/assets/mustangcat-interview-bg.jpg',
  },

  registration: {
    formTitle: 'Contact Information',
    formSubtitle: 'We will use this to follow up with you.',
    fields: [
      { id: 'fullName', label: 'Full Name', placeholder: 'Full name', required: true },
      { id: 'email', label: 'Email Address', placeholder: 'you@email.com', required: true },
      { id: 'phone', label: 'Phone Number', placeholder: '(555) 555-5555', required: true },
    ],
  },

  steps: [
    {
      type: 'splash',
      id: 'welcome',
      title: 'Welcome to',
      gradientWord: 'Open Interviews.',
      subtitle: 'Thank you for coming in today. Please tap "Begin" below to get started.',
      buttonText: 'Tap to Begin',
    },
    { type: 'registration', id: 'registration' },

    {
      type: 'question',
      id: 'q1-interviewed',
      stepLabel: 'Question 1 of 7',
      title: 'Have you interviewed with Mustang Cat within the last 6 months?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
    },
    {
      type: 'question',
      id: 'q2-application',
      stepLabel: 'Question 2 of 7',
      title: 'Have you already filled out an application with Mustang Cat?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
    },
    {
      type: 'question',
      id: 'q3-technician',
      stepLabel: 'Question 3 of 7',
      title: 'Are you applying for a technician/mechanic position?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
    },
    {
      type: 'question',
      id: 'q4-tools',
      stepLabel: 'Question 4 of 7',
      title: 'Do you have your own basic mechanic tools?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'some', label: 'Some, but not a complete set' },
      ],
    },
    {
      type: 'question',
      id: 'q5-cat-experience',
      stepLabel: 'Question 5 of 7',
      title: 'Do you have CAT (Caterpillar) specific experience?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
    },
    {
      type: 'question',
      id: 'q6-referral',
      stepLabel: 'Question 6 of 7',
      title: 'Were you referred by a current Mustang Cat employee?',
      options: [
        { value: 'yes', label: 'Yes', icon: 'user-plus' },
        { value: 'no', label: 'No', icon: 'user' },
      ],
      followUpField: {
        id: 'referralName',
        label: 'Employee name who referred you',
        placeholder: 'Full name of Mustang Cat employee',
        showWhenValue: 'yes',
        required: false,
      },
    },
    {
      type: 'multi-select',
      id: 'q7-locations',
      stepLabel: 'Question 7 of 7',
      title: 'Which Mustang Cat locations are you most interested in?',
      subtitle: 'Select all that apply',
      minSelected: 1,
      options: [
        { value: 'houston', label: 'Houston', sublabel: 'Machinery, Rental, Power' },
        { value: 'beaumont', label: 'Beaumont', sublabel: 'Machinery, Rental' },
        { value: 'bryan', label: 'Bryan', sublabel: 'Machinery, Rental' },
        { value: 'elcampo', label: 'El Campo', sublabel: 'Machinery, Rental' },
        { value: 'lufkin', label: 'Lufkin', sublabel: 'Machinery, Rental' },
        { value: 'hempstead', label: 'Hempstead', sublabel: 'Machinery, Power' },
        { value: 'tomball', label: 'Tomball', sublabel: 'Power' },
        { value: 'waller', label: 'Waller', sublabel: 'Power' },
        { value: 'channelview', label: 'Channelview', sublabel: 'Rental' },
        { value: 'deer-park', label: 'Deer Park', sublabel: 'Rental' },
        { value: 'league-city', label: 'League City', sublabel: 'Rental' },
        { value: 'angleton', label: 'Angleton', sublabel: 'Rental' },
        { value: 'missouri-city', label: 'Southwest / Missouri City', sublabel: 'Rental' },
      ],
    },

    {
      type: 'documents',
      id: 'thanks',
      title: 'Thank You!',
      subtitle: 'Thank you for coming to Open Interviews. A member of our team will be with you shortly.',
      documents: [
        { id: 'tool-list', title: 'Required Tool List', description: 'Tools needed for technician roles', url: 'https://mustangcat.com/docs/required-tools.pdf', icon: 'wrench' },
        { id: 'holiday', title: 'Holiday Schedule', description: 'Company observed holidays', url: 'https://mustangcat.com/docs/holidays.pdf', icon: 'calendar' },
        { id: 'payroll', title: 'Payroll Schedule', description: 'Pay periods and dates', url: 'https://mustangcat.com/docs/payroll.pdf', icon: 'dollar-sign' },
        { id: 'benefits', title: 'Summary of Benefits', description: 'Health, dental, vision and more', url: 'https://mustangcat.com/docs/benefits.pdf', icon: 'heart' },
        { id: 'careers', title: 'Careers Page', description: 'View all open positions', url: 'https://mustangcat.com/careers', icon: 'briefcase' },
      ],
      shareEnabled: true,
      shareChannels: ['email', 'text'],
      postShare: {
        title: "You're All Set!",
        subtitle: 'A member of our team will be with you shortly. We look forward to meeting you.',
      },
    },
  ],
};
