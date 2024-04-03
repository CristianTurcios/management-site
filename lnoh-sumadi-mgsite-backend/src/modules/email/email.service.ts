import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Mandrill } from 'mandrill-api';
import User from '../../entity/user.entity';

@Injectable()
export class EmailService {
  mandrillClient: Mandrill ;

  constructor(
        private configService: ConfigService,
  ) {
    // Constructor
  }

  async sendEmail(data: any): Promise<void> {
    this.mandrillClient = new Mandrill(this.configService.get('MANDRILL_API_KEY'));
    const emailFrom = this.configService.get('MANDRILL_EMAIL_FROM');

    const message = {
      html: data.html,
      subject: data.subject,
      from_email: emailFrom,
      to: [{
        email: data.to,
        name: `${data.firstName} ${data.lastName}`,
        type: 'to',
      }],
    };
    const async = false;
    const ipPool = 'Main Pool';
    const sendAt = ' 1999-12-31 20:20:20';

    return new Promise<any>((res) => {
      this.mandrillClient.messages.send({
        message,
        async,
        ip_pool: ipPool,
        send_at: sendAt,
      }, () => res('Mail sent'), () => {
        res('Mail not sent');
      });
    });
  }

  async sendPasswordResetEmail(user: User): Promise<void> {
    let message: string;
    const clientUrl = this.configService.get<string>('CLIENT_URL');
    if (clientUrl) {
      const resetUrl = `${clientUrl}/change-password/${user.resetToken}`;
      message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>`;
    }

    await this.sendEmail({
      html: `<h4>Reset Password Email</h4>
               ${message}`,
      subject: 'Sign-up Verification API - Reset Password',
      to: user.email,
    });
  }

  async sendVerificationEmail(user: User): Promise<void> {
    let message: string;
    const apiUrl = this.configService.get<string>('API_URL');
    if (apiUrl) {
      const verifyUrl = `${apiUrl}/authentication/verify-email?token=${user.verificationToken}`;
      message = `<p>Please click the below link to verify your email address:</p>
                   <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
    }

    await this.sendEmail({
      to: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      subject: 'Sign-up Verification API - Verify Email',
      html: `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`,
    });
  }
}
