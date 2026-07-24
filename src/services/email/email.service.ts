import { resendProvider } from './resend.provider';
import { getOTPEmailHtml } from '../../templates/otpEmail';
import * as React from 'react';

export class EmailService {
  private fromEmail: string;

  constructor() {
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  }

  /**
   * Sends OTP verification email to the user
   */
  async sendOTPEmail(recipientEmail: string, otp: string, expiryMinutes: number = 5): Promise<any> {
    console.log(`[EmailService] Preparing OTP email for ${recipientEmail}...`);

    try {
      const emailHtml = getOTPEmailHtml(otp, expiryMinutes);

      const response = await resendProvider.sendEmail({
        from: this.fromEmail,
        to: recipientEmail,
        subject: `[BariVivah] Verify your email address`,
        html: emailHtml,
      });

      console.log(`[EmailService] OTP email successfully sent to ${recipientEmail}. Message ID: ${response?.id}`);
      return response;
    } catch (error: any) {
      console.error(`[EmailService] Failed to send OTP email to ${recipientEmail}:`, error);
      throw error;
    }
  }

  /**
   * Future transactional emails can be added here
   * e.g., sendWelcomeEmail, sendPasswordResetEmail, etc.
   */
}

export const emailService = new EmailService();
export default emailService;
