export const getPasswordResetEmailTemplate = (
  userName: string,
  resetUrl: string,
): string => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Restablecimiento de contraseña - Nannys</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Poppins', Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          margin: 0;
          padding: 20px;
        }
        
        .email-container {
          max-width: 650px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #FF6B9D 0%, #FFB347 50%, #4A90E2 100%);
          color: white;
          text-align: center;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="locks" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"><text x="15" y="20" font-size="12" fill="%23ffffff" opacity="0.1" text-anchor="middle">🔒</text></pattern></defs><rect width="100" height="100" fill="url(%23locks)"/></svg>') repeat;
          animation: float 15s infinite linear;
          z-index: 1;
        }
        
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-30px, -30px) rotate(360deg); }
        }
        
        .logo-container {
          position: relative;
          z-index: 2;
          margin-bottom: 20px;
        }
        
        .logo {
          width: 120px;
          height: auto;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          border: 3px solid rgba(255,255,255,0.3);
        }
        
        .header h1 {
          position: relative;
          z-index: 2;
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .security-badge {
          background: rgba(255,255,255,0.2);
          padding: 8px 20px;
          border-radius: 25px;
          display: inline-block;
          margin-top: 10px;
          font-size: 14px;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }
        
        .content {
          padding: 40px 30px;
          background: #ffffff;
        }
        
        .greeting {
          font-size: 24px;
          color: #FF6B9D;
          font-weight: 600;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .intro-section {
          background: linear-gradient(135deg, #fff3cd 0%, #fef7e0 100%);
          padding: 25px;
          border-radius: 15px;
          border-left: 4px solid #FFB347;
          margin-bottom: 30px;
          text-align: center;
        }
        
        .intro-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }
        
        .intro-text {
          font-size: 16px;
          color: #856404;
          margin-bottom: 15px;
        }
        
        .cta-section {
          text-align: center;
          margin: 40px 0;
          padding: 30px;
          background: linear-gradient(135deg, #FF6B9D 0%, #FFB347 100%);
          border-radius: 20px;
          color: white;
        }
        
        .cta-text {
          font-size: 18px;
          margin-bottom: 20px;
          font-weight: 600;
        }
        
        .button {
          display: inline-block;
          padding: 18px 45px;
          background: linear-gradient(135deg, #4A90E2 0%, #50C878 100%);
          color: white;
          text-decoration: none;
          border-radius: 30px;
          font-weight: 700;
          font-size: 16px;
          box-shadow: 0 10px 25px rgba(74, 144, 226, 0.3);
          transition: all 0.3s ease;
          border: 2px solid rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(74, 144, 226, 0.4);
        }
        
        .warning-section {
          background: linear-gradient(135deg, #ffebee 0%, #fce4ec 100%);
          border: 2px solid #f8bbd9;
          padding: 25px;
          border-radius: 15px;
          margin: 30px 0;
        }
        
        .warning-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          color: #c2185b;
          font-weight: 700;
          font-size: 18px;
        }
        
        .warning-icon {
          font-size: 24px;
          margin-right: 10px;
        }
        
        .warning-list {
          list-style: none;
          padding: 0;
        }
        
        .warning-list li {
          padding: 8px 0;
          color: #880e4f;
          font-weight: 500;
          position: relative;
          padding-left: 25px;
        }
        
        .warning-list li::before {
          content: '🔐';
          position: absolute;
          left: 0;
          top: 8px;
        }
        
        .url-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          border: 2px dashed #dee2e6;
          margin: 20px 0;
          text-align: center;
        }
        
        .url-text {
          font-family: 'Courier New', monospace;
          word-break: break-all;
          color: #495057;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .divider {
          height: 3px;
          background: linear-gradient(135deg, #FF6B9D 0%, #FFB347 50%, #4A90E2 100%);
          margin: 30px 0;
          border-radius: 3px;
        }
        
        .security-tips {
          background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
          padding: 25px;
          border-radius: 15px;
          border-left: 4px solid #50C878;
          margin: 30px 0;
        }
        
        .security-tips h3 {
          color: #2e7d32;
          margin-bottom: 15px;
          font-size: 18px;
          display: flex;
          align-items: center;
        }
        
        .security-tips h3::before {
          content: '🛡️';
          margin-right: 10px;
          font-size: 20px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header with Logo -->
        <div class="header">
          <div class="logo-container">
            <img src="cid:logo" alt="Nannys Logo" class="logo" />
          </div>
          <h1>🔒 Restablecimiento de Contraseña</h1>
          <div class="security-badge">Solicitud de Seguridad</div>
        </div>

        <!-- Main Content -->
        <div class="content">
          <div class="greeting">¡Hola ${userName}! 👋</div>
          
          <div class="intro-section">
            <div class="intro-icon">🔑</div>
            <div class="intro-text">
              <strong>Hemos recibido una solicitud para restablecer la contraseña</strong><br>
              de tu cuenta en Nannys. Tu seguridad es nuestra prioridad.
            </div>
          </div>

          <!-- Call to Action -->
          <div class="cta-section">
            <div class="cta-text">¿Fuiste tú quien solicitó este cambio?</div>
            <a href="${resetUrl}" class="button">🚀 Restablecer Contraseña</a>
          </div>

          <div class="divider"></div>

          <!-- Security Warning -->
          <div class="warning-section">
            <div class="warning-header">
              <span class="warning-icon">⚠️</span>
              Información de Seguridad Importante
            </div>
            <ul class="warning-list">
              <li>Este enlace es válido por <strong>1 hora únicamente</strong></li>
              <li>Solo puede ser usado <strong>una vez</strong></li>
              <li>Si no solicitaste este cambio, <strong>ignora este correo</strong></li>
              <li>Nunca compartas este enlace con nadie</li>
            </ul>
          </div>

          <!-- Alternative URL Section -->
          <div style="margin: 30px 0;">
            <p style="color: #666; text-align: center; margin-bottom: 15px;">
              <strong>¿No puedes hacer clic en el botón?</strong><br>
              Copia y pega el siguiente enlace en tu navegador:
            </p>
            <div class="url-section">
              <div class="url-text">${resetUrl}</div>
            </div>
          </div>

          <!-- Security Tips -->
          <div class="security-tips">
            <h3>Consejos de Seguridad</h3>
            <p style="color: #2e7d32; margin-bottom: 10px;">
              ✅ Si no solicitaste este cambio, tu cuenta sigue siendo segura
            </p>
            <p style="color: #2e7d32; margin-bottom: 10px;">
              ✅ Nunca compartas tus credenciales de acceso
            </p>
            <p style="color: #2e7d32;">
              ✅ Usa contraseñas seguras y únicas para cada servicio
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              <strong>¿Necesitas ayuda?</strong><br>
              Si tienes problemas o dudas sobre la seguridad de tu cuenta,<br>
              contáctanos inmediatamente. Estamos aquí para protegerte.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; text-align: center; border-top: 3px solid #FF6B9D;">
          <div style="color: #FF6B9D; font-weight: 600; font-size: 16px; margin-bottom: 10px;">
            🛡️ Tu seguridad es nuestra prioridad
          </div>
          <div style="color: #666; font-size: 13px; line-height: 1.6;">
            © 2025 Nannys. Todos los derechos reservados.<br>
            Cuidando familias con la máxima seguridad<br>
            <em>Este es un correo automático, por favor no respondas a este mensaje.</em>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
