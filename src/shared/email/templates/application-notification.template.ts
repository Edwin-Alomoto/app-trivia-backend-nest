export const getApplicationNotificationTemplate = (
  applicantName: string,
  nannyName: string,
  familyName: string,
  applicationDate: string,
  frontendUrl: string | undefined,
): string => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva Aplicación - Nannys</title>
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
          background: linear-gradient(135deg, #50C878 0%, #4A90E2 50%, #FFB347 100%);
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
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="hearts" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse"><text x="12.5" y="18" font-size="10" fill="%23ffffff" opacity="0.2" text-anchor="middle">👶</text></pattern></defs><rect width="100" height="100" fill="url(%23hearts)"/></svg>') repeat;
          animation: float 25s infinite linear;
          z-index: 1;
        }
        
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-25px, -25px) rotate(360deg); }
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
        
        .notification-badge {
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
          color: #50C878;
          font-weight: 600;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .application-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 30px;
          border-radius: 20px;
          border: 2px solid #50C878;
          margin: 30px 0;
          position: relative;
          overflow: hidden;
        }
        
        .application-card::before {
          content: '👨‍👩‍👧‍👦';
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 40px;
          opacity: 0.3;
        }
        
        .application-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .application-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #50C878 0%, #4A90E2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-right: 20px;
          color: white;
          box-shadow: 0 8px 20px rgba(80, 200, 120, 0.3);
        }
        
        .application-title {
          font-size: 20px;
          font-weight: 700;
          color: #333;
          margin-bottom: 5px;
        }
        
        .application-subtitle {
          color: #666;
          font-size: 14px;
        }
        
        .application-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }
        
        .detail-item {
          background: white;
          padding: 15px;
          border-radius: 10px;
          border-left: 4px solid #50C878;
        }
        
        .detail-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }
        
        .detail-value {
          font-size: 16px;
          color: #333;
          font-weight: 600;
        }
        
        .cta-section {
          text-align: center;
          margin: 40px 0;
          padding: 30px;
          background: linear-gradient(135deg, #50C878 0%, #4A90E2 100%);
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
          padding: 15px 40px;
          background: linear-gradient(135deg, #FFB347 0%, #FF6B9D 100%);
          color: white;
          text-decoration: none;
          border-radius: 30px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 10px 25px rgba(255, 179, 71, 0.3);
          transition: all 0.3s ease;
          border: 2px solid rgba(255,255,255,0.3);
          margin: 0 10px;
        }
        
        .button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(255, 179, 71, 0.4);
        }
        
        .button.secondary {
          background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
          box-shadow: 0 10px 25px rgba(108, 117, 125, 0.3);
        }
        
        .divider {
          height: 3px;
          background: linear-gradient(135deg, #50C878 0%, #4A90E2 50%, #FFB347 100%);
          margin: 30px 0;
          border-radius: 3px;
        }
        
        .info-section {
          background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
          padding: 25px;
          border-radius: 15px;
          border-left: 4px solid #4A90E2;
          margin: 30px 0;
        }
        
        .info-section h3 {
          color: #1976d2;
          margin-bottom: 15px;
          font-size: 18px;
          display: flex;
          align-items: center;
        }
        
        .info-section h3::before {
          content: '💡';
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
          <h1>📋 Nueva Aplicación Recibida</h1>
          <div class="notification-badge">¡Una familia está interesada! 🎉</div>
        </div>

        <!-- Main Content -->
        <div class="content">
          <div class="greeting">¡Hola ${nannyName}! 👋</div>
          
          <!-- Application Card -->
          <div class="application-card">
            <div class="application-header">
              <div class="application-icon">👨‍👩‍👧‍👦</div>
              <div>
                <div class="application-title">Nueva Aplicación de Trabajo</div>
                <div class="application-subtitle">Una familia quiere conocerte mejor</div>
              </div>
            </div>
            
            <div class="application-details">
              <div class="detail-item">
                <div class="detail-label">Familia Interesada</div>
                <div class="detail-value">${familyName}</div>
              </div>
              
              <div class="detail-item">
                <div class="detail-label">Fecha de Aplicación</div>
                <div class="detail-value">${applicationDate}</div>
              </div>
              
              <div class="detail-item">
                <div class="detail-label">Candidato</div>
                <div class="detail-value">${applicantName}</div>
              </div>
              
              <div class="detail-item">
                <div class="detail-label">Estado</div>
                <div class="detail-value">🟡 Pendiente de Revisión</div>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Call to Action -->
          <div class="cta-section">
            <div class="cta-text">¿Qué te gustaría hacer ahora?</div>
            <a href="${frontendUrl}/applications" class="button">📋 Ver Aplicación Completa</a>
            <a href="${frontendUrl}/profile" class="button secondary">👤 Revisar mi Perfil</a>
          </div>

          <!-- Information Section -->
          <div class="info-section">
            <h3>Próximos Pasos</h3>
            <p style="color: #1976d2; margin-bottom: 10px;">
              ✅ <strong>Revisa la aplicación:</strong> Conoce más sobre la familia y sus necesidades
            </p>
            <p style="color: #1976d2; margin-bottom: 10px;">
              ✅ <strong>Responde rápidamente:</strong> Las familias valoran la comunicación oportuna
            </p>
            <p style="color: #1976d2; margin-bottom: 10px;">
              ✅ <strong>Actualiza tu perfil:</strong> Asegúrate de que esté completo y actualizado
            </p>
            <p style="color: #1976d2;">
              ✅ <strong>Mantén profesionalismo:</strong> La primera impresión es importante
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
            <p>🎯 <strong>Consejo:</strong> Responder dentro de las primeras 24 horas aumenta tus posibilidades de éxito</p>
            <p>💬 ¿Necesitas ayuda? Estamos aquí para apoyarte en cada paso</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; text-align: center; border-top: 3px solid #50C878;">
          <div style="color: #50C878; font-weight: 600; font-size: 16px; margin-bottom: 10px;">
            🌟 ¡Tu próxima oportunidad te está esperando!
          </div>
          <div style="color: #666; font-size: 13px; line-height: 1.6;">
            © 2025 Nannys. Todos los derechos reservados.<br>
            Conectando profesionales del cuidado infantil con familias<br>
            <em>Este es un correo automático, por favor no respondas a este mensaje.</em>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
