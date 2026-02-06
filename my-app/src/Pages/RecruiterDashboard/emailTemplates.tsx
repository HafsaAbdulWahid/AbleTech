export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'application_received' | 'shortlisted' | 'interview_invitation' | 'rejection' | 'offer' | 'follow_up';
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'app_received',
    name: 'Application Received',
    subject: 'Application Received - {jobTitle} Position',
    body: `Dear {candidateName},

Thank you for your interest in the {jobTitle} position at our organization. We have successfully received your application and resume.

Our recruitment team will carefully review your qualifications and experience. We will contact you within 5-7 business days regarding the next steps in our selection process.

If you have any questions in the meantime, please feel free to reach out to us.

Best regards,
{recruiterName}
Recruitment Team`,
    category: 'application_received'
  },
  {
    id: 'shortlisted',
    name: 'Shortlisted for Interview',
    subject: 'Congratulations! You\'ve been shortlisted - {jobTitle} Position',
    body: `Dear {candidateName},

Congratulations! After reviewing your application for the {jobTitle} position, we are pleased to inform you that you have been shortlisted for the next round of our selection process.

We were impressed by your qualifications and experience, and we would like to invite you for an interview. Our team will contact you shortly to schedule a convenient time.

Please keep your calendar flexible for the upcoming week, and ensure your contact information is up to date.

We look forward to meeting you and discussing this exciting opportunity further.

Best regards,
{recruiterName}
Recruitment Team`,
    category: 'shortlisted'
  },
  {
    id: 'interview_invite',
    name: 'Interview Invitation',
    subject: 'Interview Invitation - {jobTitle} Position',
    body: `Dear {candidateName},

We are pleased to invite you for an interview for the {jobTitle} position at our organization.

Interview Details:
- Date: [Please specify date]
- Time: [Please specify time]  
- Duration: Approximately 45-60 minutes
- Format: [In-person/Virtual - Please specify]
- Location/Meeting Link: [Please specify]

Please confirm your availability by replying to this email. If the proposed time doesn't work for you, please suggest alternative times within the next week.

What to expect:
- Discussion about your experience and qualifications
- Overview of the role and company culture
- Opportunity for you to ask questions

Please bring a copy of your resume and any relevant portfolio/work samples.

We look forward to meeting you.

Best regards,
{recruiterName}
Recruitment Team`,
    category: 'interview_invitation'
  },
  {
    id: 'offer',
    name: 'Job Offer',
    subject: 'Job Offer - {jobTitle} Position',
    body: `Dear {candidateName},

We are delighted to extend an offer for the {jobTitle} position at our organization. After careful consideration of your qualifications and interview performance, we believe you would be an excellent addition to our team.

This offer is contingent upon:
- Satisfactory completion of background verification
- Reference checks
- Any required documentation

Our HR team will contact you within the next 2-3 business days with detailed offer documentation, including compensation, benefits, and start date information.

Please confirm your continued interest in this position by replying to this email. We are excited about the possibility of you joining our team.

Congratulations and welcome aboard!

Best regards,
{recruiterName}
Recruitment Team`,
    category: 'offer'
  },
  {
    id: 'rejection',
    name: 'Application Update',
    subject: 'Update on Your Application - {jobTitle} Position',
    body: `Dear {candidateName},

Thank you for your interest in the {jobTitle} position and for taking the time to apply with our organization.

After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current requirements. This was a difficult decision, as we received many impressive applications.

We encourage you to continue monitoring our career opportunities, as we frequently have new openings that might align with your skills and interests. Your resume will remain in our database for future consideration.

Thank you again for considering us as a potential employer. We wish you the very best in your job search.

Best regards,
{recruiterName}
Recruitment Team`,
    category: 'rejection'
  },
  {
    id: 'follow_up',
    name: 'Follow-up Communication',
    subject: 'Following up on your application - {jobTitle}',
    body: `Dear {candidateName},

I hope this email finds you well. I am following up regarding your application for the {jobTitle} position.

We are currently in the process of reviewing applications and wanted to keep you updated on our timeline. We expect to complete the initial review phase by [Date] and will contact shortlisted candidates for the next steps.

We appreciate your patience during this process and your continued interest in our organization.

If you have any questions or updates to your application, please don't hesitate to reach out.

Best regards,
{recruiterName}
Recruitment Team`,
    category: 'follow_up'
  }
];