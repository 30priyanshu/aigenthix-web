import html
from typing import Optional

import resend

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class EmailService:

    def __init__(self) -> None:
        self._to_email = settings.CONTACT_NOTIFICATION_EMAIL
        self._from_email = settings.CONTACT_FROM_EMAIL or "AiGENThix <onboarding@resend.dev>"
        self._configured = bool(settings.RESEND_API_KEY and self._to_email)

        if self._configured:
            resend.api_key = settings.RESEND_API_KEY
            logger.info(f"EmailService initialized | from={self._from_email} | to={self._to_email}")
        else:
            logger.warning("EmailService disabled | missing RESEND_API_KEY or CONTACT_NOTIFICATION_EMAIL")

    @property
    def is_configured(self) -> bool:
        return self._configured

    def send_contact_notification(
        self,
        *,
        first_name: str,
        last_name: str,
        email: str,
        company_name: str,
        job_title: str,
        country: str,
        comments: str,
        phone_number: Optional[str] = None,
    ) -> bool:
        if not self._configured:
            logger.debug(f"Email skipped (not configured) | email={email}")
            return False

        safe = {
            "first_name": html.escape(first_name),
            "last_name": html.escape(last_name),
            "email": html.escape(email),
            "company_name": html.escape(company_name),
            "job_title": html.escape(job_title),
            "country": html.escape(country),
            "comments": html.escape(comments).replace("\n", "<br>"),
            "phone": html.escape(phone_number) if phone_number else "N/A",
        }

        try:
            params: resend.Emails.SendParams = {
                "from": self._from_email,
                "to": [self._to_email],
                "subject": f"[AiGENThix Contact] {safe['first_name']} {safe['last_name']} — {safe['company_name']}",
                "html": self._build_html(safe),
                "reply_to": email,
            }

            result = resend.Emails.send(params)
            logger.info(
                f"Email sent | resend_id={result.get('id', 'unknown')} | "
                f"to={self._to_email} | from_contact={email} | company={company_name}"
            )
            return True

        except resend.exceptions.ResendError as exc:
            logger.error(f"Resend API error | email={email} | error={exc}")
            return False
        except Exception as exc:
            logger.error(f"Email send failed | email={email} | error={type(exc).__name__}: {exc}")
            return False

    def send_careers_notification(
        self,
        *,
        full_name: str,
        email: str,
        position: str,
        phone: Optional[str] = None,
        experience: Optional[str] = None,
        message: Optional[str] = None,
        resume_url: Optional[str] = None,
        resume_filename: Optional[str] = None,
    ) -> bool:
        if not self._configured:
            logger.debug(f"Email skipped (not configured) | email={email}")
            return False

        safe = {
            "full_name": html.escape(full_name),
            "email": html.escape(email),
            "position": html.escape(position),
            "phone": html.escape(phone) if phone else "N/A",
            "experience": html.escape(experience) if experience else "N/A",
            "message": html.escape(message).replace("\n", "<br>") if message else "N/A",
            "resume_url": html.escape(resume_url) if resume_url else None,
        }

        try:
            params: resend.Emails.SendParams = {
                "from": self._from_email,
                "to": [self._to_email],
                "subject": f"[AiGENThix Careers] {safe['full_name']} — {safe['position']}",
                "html": self._build_careers_html(safe),
                "reply_to": email,
            }

            if resume_url and resume_filename:
                params["attachments"] = [
                    {
                        "path": resume_url,
                        "filename": resume_filename,
                    }
                ]
                logger.info(f"Resume attachment added | filename={resume_filename}")

            result = resend.Emails.send(params)
            logger.info(
                f"Email sent | resend_id={result.get('id', 'unknown')} | "
                f"to={self._to_email} | from_contact={email} | position={position}"
            )
            return True

        except resend.exceptions.ResendError as exc:
            logger.error(f"Resend API error | email={email} | error={exc}")
            return False
        except Exception as exc:
            logger.error(f"Email send failed | email={email} | error={type(exc).__name__}: {exc}")
            return False

    @staticmethod
    def _build_html(safe: dict) -> str:
        return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f4f4f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <tr>
          <td style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:28px 32px;">
            <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">New Contact Form Submission</h1>
            <p style="margin:6px 0 0;color:#bfdbfe;font-size:14px;">AiGENThix Website</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e4e4e7;">
                  <span style="color:#71717a;font-size:13px;display:block;">Name</span>
                  <span style="color:#18181b;font-size:15px;font-weight:500;">{safe['first_name']} {safe['last_name']}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e4e4e7;">
                  <span style="color:#71717a;font-size:13px;display:block;">Email</span>
                  <a href="mailto:{safe['email']}" style="color:#2563eb;font-size:15px;text-decoration:none;">{safe['email']}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e4e4e7;">
                  <span style="color:#71717a;font-size:13px;display:block;">Company</span>
                  <span style="color:#18181b;font-size:15px;font-weight:500;">{safe['company_name']}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e4e4e7;">
                  <span style="color:#71717a;font-size:13px;display:block;">Job Title</span>
                  <span style="color:#18181b;font-size:15px;">{safe['job_title']}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e4e4e7;">
                  <span style="color:#71717a;font-size:13px;display:block;">Phone</span>
                  <span style="color:#18181b;font-size:15px;">{safe['phone']}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e4e4e7;">
                  <span style="color:#71717a;font-size:13px;display:block;">Country</span>
                  <span style="color:#18181b;font-size:15px;">{safe['country']}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 0 0;">
                  <span style="color:#71717a;font-size:13px;display:block;margin-bottom:6px;">Message</span>
                  <div style="color:#18181b;font-size:15px;line-height:1.6;background:#f9fafb;padding:14px;border-radius:8px;border:1px solid #e4e4e7;">
                    {safe['comments']}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;background-color:#f9fafb;border-top:1px solid #e4e4e7;">
            <p style="margin:0;color:#a1a1aa;font-size:12px;text-align:center;">
              This email was sent from the AiGENThix contact form. Reply directly to respond to {safe['first_name']}.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""

    @staticmethod
    def _build_careers_html(safe: dict) -> str:
        resume_section = ""
        if safe['resume_url']:
            resume_section = f"""
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e4e4e7;">
                  <span style="color:#71717a;font-size:13px;display:block;">Resume</span>
                  <span style="color:#18181b;font-size:14px;">📎 Attached to this email</span>
                  <br>
                  <a href="{safe['resume_url']}" style="color:#2563eb;font-size:13px;text-decoration:none;">View online ↗</a>
                </td>
              </tr>
            """
        
        return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f4f4f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <tr>
          <td style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:28px 32px;">
            <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">New Career Application</h1>
            <p style="margin:6px 0 0;color:#bfdbfe;font-size:14px;">AiGENThix Website</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e4e4e7;">
                  <span style="color:#71717a;font-size:13px;display:block;">Full Name</span>
                  <span style="color:#18181b;font-size:15px;font-weight:500;">{safe['full_name']}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e4e4e7;">
                  <span style="color:#71717a;font-size:13px;display:block;">Email</span>
                  <a href="mailto:{safe['email']}" style="color:#2563eb;font-size:15px;text-decoration:none;">{safe['email']}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e4e4e7;">
                  <span style="color:#71717a;font-size:13px;display:block;">Phone</span>
                  <span style="color:#18181b;font-size:15px;">{safe['phone']}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e4e4e7;">
                  <span style="color:#71717a;font-size:13px;display:block;">Position</span>
                  <span style="color:#18181b;font-size:15px;font-weight:500;">{safe['position']}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e4e4e7;">
                  <span style="color:#71717a;font-size:13px;display:block;">Experience</span>
                  <span style="color:#18181b;font-size:15px;">{safe['experience']}</span>
                </td>
              </tr>
              {resume_section}
              <tr>
                <td style="padding:16px 0 0;">
                  <span style="color:#71717a;font-size:13px;display:block;margin-bottom:6px;">Message</span>
                  <div style="color:#18181b;font-size:15px;line-height:1.6;background:#f9fafb;padding:14px;border-radius:8px;border:1px solid #e4e4e7;">
                    {safe['message']}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;background-color:#f9fafb;border-top:1px solid #e4e4e7;">
            <p style="margin:0;color:#a1a1aa;font-size:12px;text-align:center;">
              This email was sent from the AiGENThix careers form. Reply directly to respond to {safe['full_name']}.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""
