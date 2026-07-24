import { Resend } from 'resend';
import * as React from 'react';


export class ResendProvider {
  private resend: Resend | null = null;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && apiKey !== 're_123456789') {
      this.resend = new Resend(apiKey);
    } else {
      console.warn('[ResendProvider] WARNING: RESEND_API_KEY is not defined or is placeholder. Emails will fail to send in production.');
    }
  }

  /**
   * Expose low-level send email functionality
   */
  async sendEmail(payload: {
    from: string;
    to: string | string[];
    subject: string;
    html?: string;
  }) {
    // If the API key is not fully configured, fall back to mock log in development
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === 're_123456789') {
      console.log('\n==================================================');
      console.log(`[MOCK EMAIL SENT via Resend]`);
      console.log(`From:    ${payload.from}`);
      console.log(`To:      ${payload.to}`);
      console.log(`Subject: ${payload.subject}`);
      console.log(`React Content: Exists`);
      console.log('==================================================\n');
      return { id: 'mock-email-id-' + Math.random().toString(36).substring(2, 9) };
    }

    if (!this.resend) {
      this.resend = new Resend(apiKey);
    }

    try {
      const response = await this.resend.emails.send({
        from: payload.from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      });

      if (response.error) {
        throw new Error(response.error.message || JSON.stringify(response.error));
      }

      return response.data;
    } catch (error: any) {
      console.error('[ResendProvider] Error sending email via Resend API:', error);
      throw error;
    }
  }
}

export const resendProvider = new ResendProvider();
export default resendProvider;
