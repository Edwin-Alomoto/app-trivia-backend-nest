import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import Mailjet from 'node-mailjet';
import * as path from 'path';
import * as fs from 'fs';
import {
  getPasswordResetEmailTemplate,
  getWelcomeEmailTemplate,
  getApplicationNotificationTemplate,
  getApplicationConfirmationTemplate,
  getProfileCompletedTemplate,
} from './templates';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private mailjetClient: any;
  private readonly logger = new Logger(EmailService.name);
  private useMailjet: boolean;

  constructor(private configService: ConfigService) {
    this.initializeEmailService();
  }

  private initializeEmailService() {
    const mailjetApiKey = this.configService.get<string>('MAILJET_API_KEY');
    const mailjetSecretKey =
      this.configService.get<string>('MAILJET_SECRET_KEY');

    // Use Mailjet if credentials are provided
    if (mailjetApiKey && mailjetSecretKey) {
      this.useMailjet = true;
      this.mailjetClient = new Mailjet({
        apiKey: mailjetApiKey,
        apiSecret: mailjetSecretKey,
      });
      this.logger.log('Email service initialized with Mailjet');
    } else {
      this.useMailjet = false;
      this.createSMTPTransporter();
      this.logger.log('Email service initialized with SMTP');
    }
  }

  private createSMTPTransporter() {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT');
    const isSecure = this.configService.get<boolean>('SMTP_SECURE', false);

    // Gmail specific configuration
    const config: any = {
      service: 'gmail', // Use Gmail service instead of manual host/port
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    };

    // If not using Gmail service, fall back to manual configuration
    if (smtpHost !== 'smtp.gmail.com') {
      delete config.service;
      config.host = smtpHost;
      config.port = smtpPort;
      config.secure = isSecure;
      config.requireTLS = true;
      config.tls = {
        rejectUnauthorized: false,
      };
    }

    this.transporter = nodemailer.createTransport(config);
    this.logger.log(
      `Email transporter configured with: ${JSON.stringify({
        service: config.service || 'manual',
        host: config.host || 'gmail',
        port: config.port || 'default',
        secure: config.secure || false,
      })}`,
    );
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string,
    attachments?: any[],
  ): Promise<void> {
    try {
      if (this.useMailjet) {
        await this.sendEmailWithMailjet(to, subject, html, text, attachments);
      } else {
        await this.sendEmailWithSMTP(to, subject, html, text, attachments);
      }
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  private async sendEmailWithMailjet(
    to: string,
    subject: string,
    html: string,
    text?: string,
    attachments?: any[],
  ): Promise<void> {
    const fromEmail = this.configService.get<string>('EMAIL_FROM');
    const fromName = this.configService.get<string>(
      'EMAIL_FROM_NAME',
      'Nannys',
    );

    const mailOptions: any = {
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: fromName,
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: subject,
          HTMLPart: html,
          TextPart: text || '',
        },
      ],
    };

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      const mailjetAttachments = attachments.map((att) => ({
        ContentType: att.contentType,
        Filename: att.filename,
        Base64Content: att.content,
        ContentID: att.cid,
      }));
      mailOptions.Messages[0].Attachments = mailjetAttachments;
      mailOptions.Messages[0].InlinedAttachments = mailjetAttachments;
    }

    try {
      const result = await this.mailjetClient
        .post('send', { version: 'v3.1' })
        .request(mailOptions);
      const messageInfo = result.body?.Messages?.[0]?.To?.[0];
      const messageId = messageInfo?.MessageID || 'Unknown';

      this.logger.log(
        `Email sent successfully via Mailjet to ${to}. MessageID: ${messageId}`,
      );
    } catch (error) {
      this.logger.error(`Mailjet API error:`, error);
      throw error;
    }
  }

  private async sendEmailWithSMTP(
    to: string,
    subject: string,
    html: string,
    text?: string,
    attachments?: any[],
  ): Promise<void> {
    // Verify connection before sending
    await this.verifyConnection();

    const mailOptions: any = {
      from: this.configService.get<string>('SMTP_FROM'),
      to,
      subject,
      html,
      text: text || '',
    };

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments;
    }

    const result = await this.transporter.sendMail(mailOptions);
    this.logger.log(
      `Email sent successfully via SMTP to ${to}. MessageId: ${result.messageId}`,
    );
  }

  private async verifyConnection(): Promise<void> {
    if (!this.useMailjet && this.transporter) {
      try {
        await this.transporter.verify();
        this.logger.log('SMTP connection verified successfully');
      } catch (error) {
        this.logger.error('SMTP connection verification failed', error.stack);
        throw error;
      }
    }
  }

  private getLogoAttachment(): any[] {
    try {
      // Try multiple possible logo paths
      const possiblePaths = [
        // Production/build path
        path.join(__dirname, 'images', 'logoNannysHome.png'),
        // Development path from current service location
        path.join(
          __dirname,
          '..',
          '..',
          'shared',
          'email',
          'images',
          'logoNannysHome.png',
        ),
        // Alternative development path
        path.join(
          process.cwd(),
          'src',
          'shared',
          'email',
          'images',
          'logoNannysHome.png',
        ),
        // Dist path
        path.join(
          process.cwd(),
          'dist',
          'shared',
          'email',
          'images',
          'logoNannysHome.png',
        ),
      ];

      let logoPath: string | null = null;

      // Find the first existing path
      for (const testPath of possiblePaths) {
        if (fs.existsSync(testPath)) {
          logoPath = testPath;
          break;
        }
      }

      if (!logoPath) {
        this.logger.warn(
          `Logo file not found in any of the expected locations:`,
        );
        possiblePaths.forEach((p) => this.logger.warn(`  - ${p}`));
        return [];
      }

      this.logger.log(`Logo found at: ${logoPath}`);
      const logoBuffer = fs.readFileSync(logoPath);
      const logoBase64 = logoBuffer.toString('base64');

      return [
        {
          filename: 'logoNannysHome.png',
          content: logoBase64,
          contentType: 'image/png',
          cid: 'logo',
          encoding: 'base64',
        },
      ];
    } catch (error) {
      this.logger.error('Error loading logo attachment:', error);
      return [];
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    const subject = '🎉 ¡Bienvenido a Nannys! - Registro exitoso';
    const html = getWelcomeEmailTemplate(
      userName,
      this.configService.get<string>('FRONTEND_URL'),
    );
    const attachments = this.getLogoAttachment();

    await this.sendEmail(userEmail, subject, html, undefined, attachments);
  }

  async sendPasswordResetEmail(
    userEmail: string,
    userName: string,
    resetToken: string,
  ): Promise<void> {
    const subject = '🔒 Restablecimiento de contraseña - Nannys';
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    const html = getPasswordResetEmailTemplate(userName, resetUrl);
    const attachments = this.getLogoAttachment();

    await this.sendEmail(userEmail, subject, html, undefined, attachments);
  }

  async sendApplicationNotificationEmail(
    nannyEmail: string,
    applicantName: string,
    nannyName: string,
    familyName: string,
    applicationDate: string,
  ): Promise<void> {
    const subject = '📋 ¡Nueva aplicación recibida! - Nannys';
    const html = getApplicationNotificationTemplate(
      applicantName,
      nannyName,
      familyName,
      applicationDate,
      this.configService.get<string>('FRONTEND_URL'),
    );
    const attachments = this.getLogoAttachment();

    await this.sendEmail(nannyEmail, subject, html, undefined, attachments);
  }

  async sendApplicationConfirmationEmail(
    applicantEmail: string,
    applicantName: string,
    nannyName: string,
    applicationDate: string,
  ): Promise<void> {
    const subject = '✅ Aplicación enviada exitosamente - Nannys';
    const html = getApplicationConfirmationTemplate(
      applicantName,
      nannyName,
      applicationDate,
      this.configService.get<string>('FRONTEND_URL'),
    );
    const attachments = this.getLogoAttachment();

    await this.sendEmail(applicantEmail, subject, html, undefined, attachments);
  }

  async sendProfileCompletedEmail(
    userEmail: string,
    userName: string,
    userType: 'nanny' | 'family',
  ): Promise<void> {
    const subject = '🎉 ¡Perfil completado! - Nannys';
    const html = getProfileCompletedTemplate(
      userName,
      userType,
      this.configService.get<string>('FRONTEND_URL'),
    );
    const attachments = this.getLogoAttachment();

    await this.sendEmail(userEmail, subject, html, undefined, attachments);
  }
}
