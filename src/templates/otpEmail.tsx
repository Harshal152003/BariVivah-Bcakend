import * as React from 'react';

interface OTPEmailProps {
  otp: string;
  expiryMinutes?: number;
}

export function getOTPEmailHtml(otp: string, expiryMinutes: number = 5): string {
  const logoUrl = 'https://res.cloudinary.com/et4vgn8w/image/upload/v1784918442/barivivah_branding/logo.png';

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; margin: 0 auto; max-width: 560px;">
      <div style="background-color: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #f3f4f6;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img
            src="${logoUrl}"
            alt="BariVivah Logo"
            style="height: 48px; width: auto; margin-bottom: 16px;"
          />
          <h2 style="font-size: 24px; font-weight: bold; color: #1f2937; margin: 0 0 10px 0;">Email Verification</h2>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">Hello,</p>
        <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">Use the verification code below to continue.</p>

        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; font-size: 32px; font-weight: bold; color: #e11d48; letter-spacing: 6px; padding: 12px 30px; background-color: #fff1f2; border-radius: 12px; border: 2px dashed #f43f5e;">${otp}</div>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">
          This code expires in <strong>${expiryMinutes} minutes</strong>.
        </p>

        <p style="font-size: 14px; color: #9ca3af; margin-top: 24px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
          If you didn't request this email, please ignore it.
        </p>

        <p style="font-size: 14px; color: #6b7280; margin-top: 24px; font-weight: 500;">
          Thank you,<br />
          Team BariVivah
        </p>
      </div>
    </div>
  `;
}

export const OTPEmail: React.FC<OTPEmailProps> = ({ otp, expiryMinutes = 5 }) => {
  const containerStyle: React.CSSProperties = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#f9fafb',
    padding: '40px 20px',
    margin: '0 auto',
    maxWidth: '560px',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f3f4f6',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center' as const,
    marginBottom: '24px',
  };

  const logoStyle: React.CSSProperties = {
    height: '48px',
    width: 'auto',
    marginBottom: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 10px 0',
  };

  const bodyStyle: React.CSSProperties = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#4b5563',
    margin: '0 0 24px 0',
  };

  const otpContainerStyle: React.CSSProperties = {
    textAlign: 'center' as const,
    margin: '30px 0',
  };

  const otpBoxStyle: React.CSSProperties = {
    display: 'inline-block',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#e11d48', // rose-600 color to match BariVivah branding
    letterSpacing: '6px',
    padding: '12px 30px',
    backgroundColor: '#fff1f2', // rose-50 light background
    borderRadius: '12px',
    border: '2px dashed #f43f5e',
  };

  const noteStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#9ca3af',
    marginTop: '24px',
    borderTop: '1px solid #f3f4f6',
    paddingTop: '20px',
  };

  const footerStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '24px',
    fontWeight: '500',
  };

  const logoUrl = 'https://res.cloudinary.com/et4vgn8w/image/upload/v1784918442/barivivah_branding/logo.png';

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <img
            src={logoUrl}
            alt="BariVivah Logo"
            style={logoStyle}
          />
          <h2 style={titleStyle}>Email Verification</h2>
        </div>

        <p style={bodyStyle}>Hello,</p>
        <p style={bodyStyle}>Use the verification code below to continue.</p>

        <div style={otpContainerStyle}>
          <div style={otpBoxStyle}>{otp}</div>
        </div>

        <p style={bodyStyle}>
          This code expires in <strong>{expiryMinutes} minutes</strong>.
        </p>

        <p style={noteStyle}>
          If you didn't request this email, please ignore it.
        </p>

        <p style={footerStyle}>
          Thank you,<br />
          Team BariVivah
        </p>
      </div>
    </div>
  );
};

export default OTPEmail;
