// Explorer Builder — Momentify Default Config
// Extracted from Brand/explorer-prototype.html

import type { ExplorerConfig } from './types';
import { MOMENTIFY_DARK, MOMENTIFY_LIGHT } from './theme';

export const MOMENTIFY_DEFAULT_CONFIG: ExplorerConfig = {
  id: 'momentify-default',
  name: 'Momentify Explorer',
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),

  branding: {
    logo: { dark: '/brand/assets/Momentify-Logo_Reverse.svg', light: '/brand/assets/Momentify-Logo.svg' },
    icon: '/brand/assets/Momentify-Icon.svg',
    colors: {
      primary: '#0CF4DF',
      secondary: '#254FE5',
      teal: '#00BBA5',
      blue: '#254FE5',
      deepBlue: '#1F3395',
      navy: '#1A2E73',
      midnight: '#0B0B3C',
      plum: '#7C316D',
      bgDark: '#07081F',
      dark: MOMENTIFY_DARK,
      light: MOMENTIFY_LIGHT,
    },
    font: "'Inter', -apple-system, sans-serif",
    backgroundPattern: 'none',
    auroraOrbs: {
      orb1: 'rgba(12,244,223,0.12)',
      orb2: 'rgba(37,79,229,0.15)',
      orb3: 'rgba(124,49,109,0.1)',
    },
    ctaGradient: 'linear-gradient(135deg, #00BBA5, #1A56DB)',
    ctaTextColor: '#FFFFFF',
    gradientWord: 'linear-gradient(135deg, #0CF4DF, #254FE5)',
    roleBackgrounds: {
      executive: 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(124,49,109,0.45) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 15%, rgba(31,51,149,0.3) 0%, transparent 55%)',
      vp: 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(31,51,149,0.4) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 15%, rgba(0,187,165,0.25) 0%, transparent 55%)',
      manager: 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(0,187,165,0.35) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 25%, rgba(12,244,223,0.2) 0%, transparent 55%)',
      engineer: 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(37,79,229,0.4) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 25%, rgba(12,244,223,0.3) 0%, transparent 55%)',
      purchasing: 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(0,187,165,0.35) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 25% 15%, rgba(124,49,109,0.25) 0%, transparent 55%)',
      operations: 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(12,244,223,0.3) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 75% 15%, rgba(31,51,149,0.35) 0%, transparent 55%)',
      student: 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(37,79,229,0.35) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 15% 15%, rgba(124,49,109,0.3) 0%, transparent 55%)',
      other: 'radial-gradient(ellipse 90% 70% at 50% 70%, rgba(124,49,109,0.3) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 25%, rgba(0,187,165,0.2) 0%, transparent 55%)',
    },
  },

  registration: {
    modes: ['scan', 'form', 'search'],
    defaultMode: 'scan',
    formTitle: 'Tell us about yourself',
    formSubtitle: 'Please fill in the form to continue.',
    scanLabel: 'Please Scan Your Badge',
    scanHint: 'Hold the QR code in front of the camera',
    searchPlaceholder: 'Search by last name...',
    optInText: 'Submitting this form could set your preferences to allow us to send you marketing. By sharing your information you are giving permission to process your data to appropriately fulfill your request.',
    showLocaleButton: true,
    idleTimeoutMs: 10000,
    skipEnabled: true,
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'First name', required: true, halfWidth: true },
      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last name', required: true, halfWidth: true },
      { id: 'email', label: 'Email', type: 'email', placeholder: 'name@company.com', required: true, halfWidth: true },
      { id: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 555-5555', required: false, halfWidth: true },
      { id: 'company', label: 'Company', type: 'text', placeholder: 'Company', required: false, halfWidth: true },
    ],
  },

  steps: [
    {
      type: 'splash',
      id: 'welcome',
      title: 'Empower Every',
      gradientWord: 'Moment.',
      subtitle: 'Discover personalized outcomes, content, and solutions tailored to your needs.',
      buttonText: 'Tap to Begin',
    },
    {
      type: 'registration',
      id: 'registration',
    },
    {
      type: 'trait-selection',
      id: 'role',
      selectionMode: 'single',
      title: 'What best describes your role?',
      subtitle: 'Select the option that fits you best.',
      showGreeting: true,
      showSelectAll: false,
      options: [
        { value: 'executive', label: 'Executive / C-Suite', icon: 'briefcase', iconType: 'lucide' },
        { value: 'vp', label: 'VP / Director', icon: 'presentation', iconType: 'lucide' },
        { value: 'manager', label: 'Manager', icon: 'users', iconType: 'lucide' },
        { value: 'engineer', label: 'Engineer / Technical', icon: 'code', iconType: 'lucide' },
        { value: 'purchasing', label: 'Purchasing / Procurement', icon: 'banknote', iconType: 'lucide' },
        { value: 'operations', label: 'Operations', icon: 'star', iconType: 'lucide' },
        { value: 'student', label: 'Student / Educator', icon: 'graduation-cap', iconType: 'lucide' },
        { value: 'other', label: 'Other', icon: 'message-circle', iconType: 'lucide' },
      ],
    },
    {
      type: 'trait-selection',
      id: 'interests',
      selectionMode: 'multi',
      title: 'What are you most interested in?',
      subtitle: 'Select all that apply.',
      showGreeting: false,
      showSelectAll: true,
      options: [
        { value: 'demos', label: 'Product Demos', icon: 'presentation', iconType: 'lucide' },
        { value: 'pricing', label: 'Pricing / Quotes', icon: 'dollar-sign', iconType: 'lucide' },
        { value: 'specs', label: 'Technical Specs', icon: 'settings', iconType: 'lucide' },
        { value: 'partnership', label: 'Partnership', icon: 'users', iconType: 'lucide' },
        { value: 'case-studies', label: 'Case Studies', icon: 'building', iconType: 'lucide' },
        { value: 'training', label: 'Training / Support', icon: 'graduation-cap', iconType: 'lucide' },
        { value: 'schedule', label: 'Schedule Meeting', icon: 'calendar', iconType: 'lucide' },
        { value: 'browsing', label: 'Just Browsing', icon: 'message-circle', iconType: 'lucide' },
      ],
    },
    {
      type: 'results',
      id: 'results',
      title: 'Your Personalized Results',
      subtitle: 'Curated outcomes, content, and solutions based on your profile.',
      tabs: [
        { id: 'outcomes', label: 'Outcomes', icon: 'target' },
        { id: 'learn', label: 'Learn', icon: 'book-open', filters: [
          { label: 'All', value: 'all' },
          { label: 'Video', value: 'video' },
          { label: 'PDF', value: 'pdf' },
          { label: 'Blog', value: 'blog' },
          { label: 'Webinar', value: 'webinar' },
        ]},
        { id: 'solutions', label: 'Solutions', icon: 'puzzle' },
      ],
      cardsPerPage: 6,
      defaultView: 'small',
    },
    {
      type: 'summary',
      id: 'summary',
      title: 'Your Saved Items',
      subtitle: 'Review and share your curated content.',
    },
    {
      type: 'content-library',
      id: 'library',
      title: 'Content Library',
      subtitle: 'Browse all available content.',
    },
    {
      type: 'thank-you',
      id: 'thanks',
      title: 'Thank You!',
      subtitle: 'We appreciate your time. Your personalized content will be sent to you shortly.',
      showNewSessionButton: true,
      showAddNotesButton: true,
    },
  ],

  content: [
    // Outcomes
    {
      id: 'o1', title: '40% Faster Deployment', cardType: 'outcome', icon: 'zap', iconType: 'lucide',
      stat: '40%',
      description: { small: 'Reduce deployment time significantly.', medium: 'Reduce deployment time by up to 40% with streamlined processes and automation.', large: 'Our platform helps organizations reduce deployment time by up to 40% through streamlined workflows, intelligent automation, and real-time collaboration tools that eliminate bottlenecks.', overlay: 'Organizations using our platform have consistently reported deployment time reductions of up to 40%. This is achieved through our proprietary automation engine, real-time collaboration features, and intelligent workflow optimization.' },
      tags: ['efficiency', 'automation'], targetRoles: ['engineer', 'operations', 'manager'],
    },
    {
      id: 'o2', title: '3x ROI Within First Year', cardType: 'outcome', icon: 'trending-up', iconType: 'lucide',
      stat: '3x',
      description: { small: 'Triple your return on investment.', medium: 'Achieve 3x ROI within the first year through measurable impact.', large: 'Our customers consistently achieve 3x return on investment within their first year through measurable improvements in engagement, lead quality, and conversion rates.', overlay: 'The path to 3x ROI begins with our platform\'s ability to capture and qualify leads with unprecedented accuracy, turning every interaction into actionable data that drives revenue.' },
      tags: ['roi', 'growth'], targetRoles: ['executive', 'vp'],
    },
    {
      id: 'o3', title: '85% Lead Qualification Rate', cardType: 'outcome', icon: 'filter', iconType: 'lucide',
      stat: '85%',
      description: { small: 'Qualify more leads automatically.', medium: 'Achieve an 85% lead qualification rate with intelligent scoring.', large: 'Our intelligent lead scoring and engagement tracking achieves an 85% qualification rate, ensuring your sales team focuses on the highest-value prospects.', overlay: 'By combining behavioral signals, content engagement patterns, and AI-powered scoring, our platform achieves an industry-leading 85% lead qualification rate.' },
      tags: ['leads', 'qualification'], targetRoles: ['vp', 'manager', 'purchasing'],
    },
    {
      id: 'o4', title: '60% Increase in Engagement', cardType: 'outcome', icon: 'bar-chart-2', iconType: 'lucide',
      stat: '60%',
      description: { small: 'Boost attendee engagement.', medium: 'Drive 60% more engagement through personalized experiences.', large: 'Create personalized attendee experiences that drive 60% more engagement through intelligent content matching, real-time interactions, and data-driven insights.', overlay: 'Personalization is the key to engagement. Our platform matches attendees with relevant content, sessions, and connections, resulting in a 60% increase in meaningful interactions.' },
      tags: ['engagement', 'personalization'], targetRoles: ['manager', 'operations'],
    },
    {
      id: 'o5', title: '50% Reduction in Manual Work', cardType: 'outcome', icon: 'clock', iconType: 'lucide',
      stat: '50%',
      description: { small: 'Cut manual processes in half.', medium: 'Reduce manual workflows by 50% with intelligent automation.', large: 'Eliminate repetitive tasks and reduce manual workflows by 50% with our intelligent automation, freeing your team to focus on high-impact strategic work.', overlay: 'Our automation suite handles data entry, follow-up scheduling, content distribution, and reporting, cutting manual work by 50% and reducing errors.' },
      tags: ['automation', 'efficiency'], targetRoles: ['operations', 'manager'],
    },
    {
      id: 'o6', title: 'Real-Time Analytics Dashboard', cardType: 'outcome', icon: 'activity', iconType: 'lucide',
      description: { small: 'Live event performance data.', medium: 'Monitor event performance with real-time analytics and actionable insights.', large: 'Get instant visibility into event performance with our real-time analytics dashboard, featuring live engagement metrics, lead scoring, and ROI tracking.', overlay: 'Our real-time analytics dashboard provides instant visibility into every aspect of your event, from foot traffic and session attendance to lead quality and content engagement.' },
      tags: ['analytics', 'insights'], targetRoles: ['executive', 'vp', 'manager'],
    },
    // Learn
    {
      id: 'l1', title: 'The Future of Event Engagement', cardType: 'learn', mediaType: 'video', icon: 'play', iconType: 'lucide',
      description: { small: 'Watch our keynote presentation.', medium: 'Explore how modern events are transforming attendee engagement through technology.', large: 'A comprehensive look at how technology is reshaping event engagement, from AI-powered personalization to real-time analytics.', overlay: 'In this keynote presentation, our CEO explores the evolution of event engagement and how emerging technologies are creating unprecedented opportunities for meaningful connections.' },
      tags: ['video', 'engagement'], url: '#',
    },
    {
      id: 'l2', title: 'ROI Measurement Best Practices', cardType: 'learn', mediaType: 'pdf', icon: 'file-text', iconType: 'lucide',
      description: { small: 'Download our measurement guide.', medium: 'Learn the proven frameworks for measuring and maximizing event ROI.', large: 'A comprehensive guide covering the essential frameworks, metrics, and strategies for accurately measuring and maximizing your event return on investment.', overlay: 'This guide covers everything from setting up attribution models to creating executive-ready ROI reports that demonstrate the true value of your event investments.' },
      tags: ['pdf', 'roi'], url: '#',
    },
    {
      id: 'l3', title: 'Lead Scoring That Actually Works', cardType: 'learn', mediaType: 'blog', icon: 'file-text', iconType: 'lucide',
      description: { small: 'Read our approach to lead scoring.', medium: 'Discover why traditional lead scoring fails and what to do instead.', large: 'Traditional lead scoring methods miss critical engagement signals. Learn how behavioral and contextual scoring delivers qualified leads your sales team will actually want to follow up on.', overlay: 'This article breaks down why traditional demographic-based lead scoring fails at events and introduces our behavioral scoring methodology that captures actual buying signals.' },
      tags: ['blog', 'leads'], url: '#',
    },
    {
      id: 'l4', title: 'Automation Strategies Webinar', cardType: 'learn', mediaType: 'webinar', icon: 'video', iconType: 'lucide',
      description: { small: 'Watch our automation deep-dive.', medium: 'Join our experts for a deep-dive into event automation strategies.', large: 'A recorded webinar featuring our automation experts discussing practical strategies for streamlining event operations, from pre-event planning to post-event follow-up.', overlay: 'In this 45-minute webinar, our automation team walks through real-world examples of how event teams have cut manual work by 50% while improving data quality and attendee satisfaction.' },
      tags: ['webinar', 'automation'], url: '#',
    },
    {
      id: 'l5', title: 'Engagement Analytics Podcast', cardType: 'learn', mediaType: 'podcast', icon: 'headphones', iconType: 'lucide',
      description: { small: 'Listen to our analytics episode.', medium: 'Hear from industry leaders about the future of engagement analytics.', large: 'Industry leaders discuss the evolution of engagement analytics, emerging metrics, and how data-driven decisions are transforming event strategy.', overlay: 'In this episode, we sit down with three industry leaders to discuss how engagement analytics are evolving beyond simple metrics into predictive intelligence.' },
      tags: ['podcast', 'analytics'], url: '#',
    },
    {
      id: 'l6', title: 'Digital Transformation Whitepaper', cardType: 'learn', mediaType: 'whitepaper', icon: 'file-text', iconType: 'lucide',
      description: { small: 'Read our transformation research.', medium: 'Research-backed insights on digital transformation in the events industry.', large: 'Original research exploring how digital transformation is reshaping the events industry, with data from 500+ organizations and actionable recommendations.', overlay: 'Based on surveys of 500+ event professionals and analysis of millions of attendee interactions, this whitepaper provides a data-driven roadmap for digital transformation.' },
      tags: ['whitepaper', 'transformation'], url: '#',
    },
    // Solutions
    {
      id: 's1', title: 'Event Intelligence Platform', cardType: 'solution', icon: 'cpu', iconType: 'lucide',
      description: { small: 'AI-powered event analytics.', medium: 'Our flagship AI-powered platform for comprehensive event intelligence.', large: 'The Event Intelligence Platform combines real-time analytics, AI-powered insights, and predictive modeling to give you complete visibility into event performance and attendee behavior.', overlay: 'Our Event Intelligence Platform is the industry\'s most comprehensive solution for understanding and optimizing event performance, from pre-event planning through post-event analysis.' },
      tags: ['platform', 'analytics'],
    },
    {
      id: 's2', title: 'Lead Capture Suite', cardType: 'solution', icon: 'scan', iconType: 'lucide',
      description: { small: 'Unified lead capture tools.', medium: 'Complete lead capture, qualification, and routing in one unified suite.', large: 'Capture leads through badge scans, forms, and interactive experiences, then automatically qualify, score, and route them to the right team members in real time.', overlay: 'The Lead Capture Suite unifies all your lead capture methods into one intelligent system that scores, qualifies, and routes leads in real time.' },
      tags: ['leads', 'capture'],
    },
    {
      id: 's3', title: 'Content Delivery Engine', cardType: 'solution', icon: 'send', iconType: 'lucide',
      description: { small: 'Personalized content delivery.', medium: 'Deliver the right content to the right person at the right moment.', large: 'Our Content Delivery Engine uses behavioral signals and preference data to serve personalized content experiences that drive engagement and conversion.', overlay: 'The Content Delivery Engine is built on our proprietary recommendation algorithm that analyzes attendee behavior in real time to surface the most relevant content.' },
      tags: ['content', 'personalization'],
    },
    {
      id: 's4', title: 'ROX Analytics Dashboard', cardType: 'solution', icon: 'bar-chart-2', iconType: 'lucide',
      description: { small: 'Return on experience metrics.', medium: 'Measure and optimize your return on experience with advanced analytics.', large: 'Go beyond traditional ROI with our ROX Analytics Dashboard, measuring engagement quality, content impact, and attendee satisfaction alongside financial metrics.', overlay: 'The ROX Analytics Dashboard provides a holistic view of your event investment, combining financial ROI with experiential metrics.' },
      tags: ['analytics', 'rox'],
    },
    {
      id: 's5', title: 'Engagement Automation', cardType: 'solution', icon: 'repeat', iconType: 'lucide',
      description: { small: 'Automated engagement workflows.', medium: 'Automate personalized engagement workflows across the attendee journey.', large: 'Create intelligent automation workflows that trigger personalized actions based on attendee behavior, from welcome sequences to post-event follow-ups.', overlay: 'Our Engagement Automation platform lets you build sophisticated, behavior-driven workflows that deliver the right message at exactly the right moment.' },
      tags: ['automation', 'engagement'],
    },
    {
      id: 's6', title: 'Integration Hub', cardType: 'solution', icon: 'git-merge', iconType: 'lucide',
      description: { small: 'Connect your existing tools.', medium: 'Seamlessly connect with your CRM, MAP, and event platforms.', large: 'The Integration Hub provides native connections to 50+ platforms including Salesforce, HubSpot, Marketo, Cvent, and more, ensuring your event data flows seamlessly.', overlay: 'Our Integration Hub eliminates data silos by providing native, bi-directional connections to the tools your team already uses.' },
      tags: ['integration', 'crm'],
    },
  ],

  features: {
    screensaver: false,
    darkMode: true,
    lightMode: true,
    defaultTheme: 'dark',
    briefcase: true,
    share: { email: true, text: true, qr: true },
    notes: true,
    voiceCapture: true,
    mediaCapture: true,
    calculator: false,
    captureInfo: true,
  },
};
