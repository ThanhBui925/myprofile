const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport or Ethereal fallback
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : '';
  const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : '';

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return null;
};

/**
 * Send document link email to user
 */
const sendDocumentEmail = async ({ toEmail, userName, documentTitle, driveUrl, zipPassword = '', lang = 'vi', appName = 'THANHBUITDH' }) => {
  const transporter = createTransporter();

  const isEn = lang === 'en';

  const subHeader = isEn ? 'Technical Documentation & Automation Solutions' : 'Tài Liệu Kỹ Thuật & Giải Pháp Tự Động Hóa';
  const greeting = isEn ? `Hello ${userName || 'Customer'},` : `Xin chào ${userName || 'Quý khách'},`;
  const intro = isEn 
    ? `Thank you for your interest and for requesting documentation from <strong>THANHBUITDH</strong>.`
    : `Cảm ơn bạn đã quan tâm và yêu cầu nhận tài liệu từ <strong>THANHBUITDH</strong>.`;
  const accessText = isEn 
    ? `Here is your access link for: <strong style="color: #FFB380;">${documentTitle}</strong>`
    : `Dưới đây là liên kết truy cập tài liệu: <strong style="color: #FFB380;">${documentTitle}</strong>`;
  const btnText = isEn ? '📥 Download Link' : '📥 Link tải';
  const noteText = isEn
    ? `<strong style="color: #FF6B00;">⚠️ Security Notice:</strong> This link can be accessed <strong>only once</strong>. The link is designated for <code>${toEmail}</code>.`
    : `<strong style="color: #FF6B00;">⚠️ Lưu ý bảo mật:</strong> Link chỉ có thể truy cập <strong>1 lần duy nhất</strong>. Liên kết được dành riêng cho email <code>${toEmail}</code>.`;
  const subjectText = isEn ? `[THANHBUITDH] Document Access Link: ${documentTitle}` : `[THANHBUITDH] Link nhận tài liệu: ${documentTitle}`;

  const zipPassHtml = zipPassword ? `
    <div style="background-color: #1e1b18; padding: 0.85rem 1.25rem; border-radius: 8px; border: 1px solid #FF6B00; margin-top: 1rem;">
      <span style="color: #cccccc; font-size: 14px;">🔑 ${isEn ? 'Extraction Password:' : 'Mật khẩu giải nén file:'} </span>
      <strong style="color: #FF6B00; font-family: 'Courier New', monospace; font-size: 17px; letter-spacing: 1px; background: #000; padding: 3px 10px; border-radius: 4px; display: inline-block; margin-left: 6px;">${zipPassword}</strong>
    </div>
  ` : '';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0d0d0d; color: #ffffff; padding: 2rem; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #333;">
      <div style="text-align: center; margin-bottom: 2rem;">
        <h1 style="color: #FF6B00; margin: 0; font-size: 28px; letter-spacing: 1px;">THANHBUITDH</h1>
        <p style="color: #888888; font-size: 14px; margin-top: 5px;">${subHeader}</p>
      </div>

      <div style="background-color: #1a1a1a; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #FF6B00; margin-bottom: 2rem;">
        <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">${greeting}</h2>
        <p style="color: #cccccc; line-height: 1.6; font-size: 15px;">${intro}</p>
        <p style="color: #cccccc; line-height: 1.6; font-size: 15px;">${accessText}</p>
        ${zipPassHtml}
      </div>

      <div style="text-align: center; margin: 2.5rem 0;">
        <a href="${driveUrl}" target="_blank" style="background: linear-gradient(135deg, #FF6B00 0%, #FF8533 100%); color: #ffffff; padding: 14px 36px; text-decoration: none; font-weight: bold; border-radius: 30px; display: inline-block; font-size: 16px; box-shadow: 0 4px 15px rgba(255,107,0,0.4);">
          ${btnText}
        </a>
      </div>

      <div style="background-color: #141414; padding: 1rem; border-radius: 6px; font-size: 13px; color: #aaaaaa; line-height: 1.6; margin-bottom: 2rem; border: 1px dashed #FF6B00;">
        ${noteText}
      </div>

      <div style="border-top: 1px solid #222222; padding-top: 1rem; text-align: center; font-size: 13px; color: #888888;">
        <p style="margin: 4px 0;">Zalo: <a href="https://zalo.me/0326160757" style="color: #FF6B00; text-decoration: none; font-weight: bold;">0326160757</a> | Email: <a href="mailto:thanhbuietc@gmail.com" style="color: #FF6B00; text-decoration: none;">thanhbuietc@gmail.com</a></p>
      </div>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"THANHBUITDH Automation" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: subjectText,
        html: htmlContent,
      });
      console.log(`[Email Success] Sent document link email to ${toEmail}`);
      return { success: true };
    } catch (err) {
      console.error('[Email Error] Failed to send email via SMTP:', err.message);
      return { success: false, error: err.message };
    }
  } else {
    console.log(`[Email Simulation] SMTP credentials not set. Simulated email to ${toEmail}:`);
    console.log(` -> Document: ${documentTitle}`);
    console.log(` -> Drive Link: ${driveUrl}`);
    return { success: true, simulated: true };
  }
};

module.exports = { sendDocumentEmail };
