export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: white;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #0b2447;
    "
  >
    <div
      style="
        background: linear-gradient(to right, #4caf50, #45a049);
        padding: 20px;
        text-align: center;
        border: 2px solid white;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        border-bottom: none;
      "
    >
      <h1 style="color: white; margin: 0">Verify Your Email</h1>
    </div>
    <div
      style="
        background-color: rgb(255 255 255 / 0.3);
        padding: 20px;
        border-radius: 0 0 5px 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border: 2px solid white;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
      "
    >
      <p style="color: white;">Hello,</p>
      <p style="color: white;">Thank you for signing up! Your verification code is:</p>
      <div style="text-align: center; margin: 30px 0">
        <span
          style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            color: white;
          "
          >{verificationCode}</span
        >
      </div>
      <p>
        Enter this code on the verification page to complete your registration.
      </p>
      <p style="color: white;">This code will expire in 15 minutes for security reasons.</p>
      <p style="color: white;">If you didn't create an account with us, please ignore this email.</p>
      <p style="color: white;">Best regards,<br /><a href="https://themecraft-net.vercer.app/" target="_blank">ThemeCraft</a></p>
    </div>
    <div
      style="
        text-align: center;
        margin-top: 20px;
        color: #888;
        font-size: 0.8em;
      "
    >
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </body>
</html>

`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset Successful</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: white;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #0b2447;
    "
  >
    <div
      style="
        background: linear-gradient(to right, #4caf50, #45a049);
        padding: 20px;
        text-align: center;
        border: 2px solid white;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        border-bottom: none;
      "
    >
      <h1 style="color: white; margin: 0">Password Reset Successful</h1>
    </div>
    <div
      style="
        background-color: rgb(255 255 255 / 0.3);
        padding: 20px;
        border-radius: 0 0 5px 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border: 2px solid white;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
      "
    >
      <p style="color: white;">Hello,</p>
      <p style="color: white;">
        We're writing to confirm that your password has been successfully reset.
      </p>
      <div style="text-align: center; margin: 30px 0">
        <div
          style="
            background-color: #4caf50;
            color: white;
            width: 50px;
            height: 50px;
            line-height: 50px;
            border-radius: 50%;
            display: inline-block;
            font-size: 30px;
          "
        >
          ✓
        </div>
      </div>
      <p style="color: white;">
        If you did not initiate this password reset, please contact our support
        team immediately.
      </p>
      <p>For security reasons, we recommend that you:</p>
      <ul style="color: white;">
        <li>Use a strong, unique password</li>
        <li>Enable two-factor authentication if available</li>
        <li>Avoid using the same password across multiple sites</li>
      </ul>
      <p>Thank you for helping us keep your account secure.</p>
      <p>
        Best regards,<br /><a
          href="https://themecraft-net.vercel.app"
          target="_blank"
          >ThemeCraft</a
        >
      </p>
    </div>
    <div
      style="
        text-align: center;
        margin-top: 20px;
        color: #888;
        font-size: 0.8em;
      "
    >
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </body>
</html>

`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your Password</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: white;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #0b2447;
    "
  >
    <div
      style="
        background: linear-gradient(to right, #4caf50, #45a049);
        padding: 20px;
        text-align: center;
        border: 2px solid white;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        border-bottom: none;
      "
    >
      <h1 style="color: white; margin: 0">Password Reset</h1>
    </div>
    <div
      style="
        background-color: rgb(255 255 255 / 0.3);
        padding: 20px;
        border-radius: 0 0 5px 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border: 2px solid white;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
      "
    >
      <p>Hello,</p>
      <p>
        We received a request to reset your password. If you didn't make this
        request, please ignore this email.
      </p>
      <p>To reset your password, click the button below:</p>
      <div style="text-align: center; margin: 30px 0">
        <a
          href="{resetURL}"
          style="
            background-color: #4caf50;
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          "
          >Reset Password</a
        >
      </div>
      <p>This link will expire in 1 hour for security reasons.</p>
      <p>
        Best regards,<br /><a
          href="https://themecraft-net.vercel.app/"
          target="_blank"
          >ThemeCraft</a
        >
      </p>
    </div>
    <div
      style="
        text-align: center;
        margin-top: 20px;
        color: #888;
        font-size: 0.8em;
      "
    >
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </body>
</html>
`;
