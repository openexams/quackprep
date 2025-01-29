import { email_auth } from "#config/config.js";
import nodemailer from "nodemailer";

/**
 * EmailService uses nodemailer to send emails
 */
export default class EmailService {
  /**
   *
   * @param {String} to
   * @param {String} subject
   */
  constructor(to) {
    this.to = to;
  }
  static from = email_auth.user;
  /**
   * Why use static here?
transporter is a shared configuration for sending emails.
It does not need to be tied to a specific instance of EmailService—it is the same for all emails.
This means you don't need to create an instance of EmailService just to access transporter.
   */
  static transporter = nodemailer.createTransport({
    service: "gmail",
    auth: email_auth,
  });

  async sendEmail(html, subject) {
    console.log(this.to);
    try {
      dlog(`sending email to ${this.to}`);
      const config = {
        from: EmailService.from,
        to: this.to,
        subject: subject,
        html: html,
      };
      const result = await EmailService.transporter.sendMail(config);
      dlog(result.response);
      if (!result.response.includes("250") || !result.response.includes("OK")) {
        dlog(`email failed to send to ${this.to}`);
        throw new Error(`email failed to send to ${this.to}`);
      } else {
        return result.response;
      }
    } catch (e) {
      console.log("FAILED TO SEND EMAIL");
      console.error(e);
    }
  }
}
