export const getApplicationConfirmationTemplate = (
  applicantName: string,
  nannyName: string,
  applicationDate: string,
  frontendUrl: string | undefined,
): string => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Aplicación Enviada - Nannys</title>
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
          background: linear-gradient(135deg, #4A90E2 0%, #50C878 50%, #FFB347 100%);
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
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="checkmarks" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"><text x="15" y="20" font-size="12" fill="%23ffffff" opacity="0.2" text-anchor="middle">✓</text></pattern></defs><rect width="100" height="100" fill="url(%23checkmarks)"/></svg>') repeat;
          animation: float 20s infinite linear;
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
        
        .success-badge {
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
          color: #4A90E2;
          font-weight: 600;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .success-section {
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          padding: 30px;
          border-radius: 20px;
          border: 2px solid #28a745;
          margin: 30px 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .success-section::before {
          content: '🎉';
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 40px;
          opacity: 0.3;
        }
        
        .success-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          margin: 0 auto 20px;
          color: white;
          box-shadow: 0 10px 25px rgba(40, 167, 69, 0.3);
        }
        
        .success-title {
          font-size: 22px;
          font-weight: 700;
          color: #155724;
          margin-bottom: 15px;
        }
        
        .success-message {
          color: #155724;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .application-summary {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 25px;
          border-radius: 15px;
          border: 2px solid #dee2e6;
          margin: 30px 0;
        }
        
        .summary-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .summary-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #4A90E2 0%, #50C878 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin-right: 15px;
          color: white;
        }
        
        .summary-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }
        
        .summary-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .detail-item {
          background: white;
          padding: 15px;
          border-radius: 10px;
          border-left: 4px solid #4A90E2;
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
        
        .timeline-section {
          background: linear-gradient(135deg, #fff3cd 0%, #fef7e0 100%);
          padding: 25px;
          border-radius: 15px;
          border-left: 4px solid #FFB347;
          margin: 30px 0;
        }
        
        .timeline-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          color: #856404;
          font-weight: 700;
          font-size: 18px;
        }
        
        .timeline-icon {
          font-size: 24px;
          margin-right: 10px;
        }
        
        .timeline-steps {
          list-style: none;
          padding: 0;
        }
        
        .timeline-steps li {
          padding: 10px 0;
          color: #856404;
          font-weight: 500;
          position: relative;
          padding-left: 30px;
          border-left: 2px solid #FFB347;
          margin-left: 15px;
        }
        
        .timeline-steps li::before {
          content: '';
          position: absolute;
          left: -8px;
          top: 15px;
          width: 12px;
          height: 12px;
          background: #FFB347;
          border-radius: 50%;
          border: 3px solid white;
        }
        
        .timeline-steps li.completed::before {
          background: #28a745;
        }
        
        .cta-section {
          text-align: center;
          margin: 40px 0;
          padding: 30px;
          background: linear-gradient(135deg, #4A90E2 0%, #50C878 100%);
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
        
        .divider {
          height: 3px;
          background: linear-gradient(135deg, #4A90E2 0%, #50C878 50%, #FFB347 100%);
          margin: 30px 0;
          border-radius: 3px;
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
          <h1>✅ Aplicación Enviada Exitosamente</h1>
          <div class="success-badge">¡Tu solicitud está en proceso! 🚀</div>
        </div>

        <!-- Main Content -->
        <div class="content">
          <div class="greeting">¡Hola ${applicantName}! 👋</div>
          
          <!-- Success Section -->
          <div class="success-section">
            <div class="success-icon">✓</div>
            <div class="success-title">¡Aplicación Enviada con Éxito!</div>
            <div class="success-message">
              Tu solicitud para trabajar con <strong>${nannyName}</strong> ha sido enviada correctamente.
              La niñera recibirá una notificación y podrá revisar tu perfil y credenciales.
            </div>
          </div>

          <!-- Application Summary -->
          <div class="application-summary">
            <div class="summary-header">
              <div class="summary-icon">📋</div>
              <div class="summary-title">Resumen de tu Aplicación</div>
            </div>
            
            <div class="summary-details">
              <div class="detail-item">
                <div class="detail-label">Niñera Contactada</div>
                <div class="detail-value">${nannyName}</div>
              </div>
              
              <div class="detail-item">
                <div class="detail-label">Fecha de Aplicación</div>
                <div class="detail-value">${applicationDate}</div>
              </div>
              
              <div class="detail-item">
                <div class="detail-label">Tu Perfil</div>
                <div class="detail-value">${applicantName}</div>
              </div>
              
              <div class="detail-item">
                <div class="detail-label">Estado Actual</div>
                <div class="detail-value">🟡 En Revisión</div>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Timeline Section -->
          <div class="timeline-section">
            <div class="timeline-header">
              <span class="timeline-icon">⏱️</span>
              ¿Qué Sigue Ahora?
            </div>
            <ul class="timeline-steps">
              <li class="completed"><strong>Aplicación Enviada</strong> - ¡Completado!</li>
              <li><strong>Revisión de Perfil</strong> - La niñera revisará tu información</li>
              <li><strong>Respuesta Inicial</strong> - Recibirás una respuesta en 24-48 horas</li>
              <li><strong>Entrevista/Contacto</strong> - Si hay interés mutuo, coordinarán una entrevista</li>
              <li><strong>Decisión Final</strong> - Confirmación del trabajo</li>
            </ul>
          </div>

          <!-- Call to Action -->
          <div class="cta-section">
            <div class="cta-text">Mientras esperas, puedes:</div>
            <a href="${frontendUrl}/applications" class="button">📋 Ver mis Aplicaciones</a>
            <a href="${frontendUrl}/nannies" class="button">🔍 Buscar más Niñeras</a>
          </div>

          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              <strong>💡 Consejo:</strong> Mantén tu perfil actualizado y responde rápidamente<br>
              a cualquier mensaje para aumentar tus posibilidades de éxito.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; text-align: center; border-top: 3px solid #4A90E2;">
          <div style="color: #4A90E2; font-weight: 600; font-size: 16px; margin-bottom: 10px;">
            🎯 ¡Te deseamos mucho éxito en tu búsqueda!
          </div>
          <div style="color: #666; font-size: 13px; line-height: 1.6;">
            © 2025 Nannys. Todos los derechos reservados.<br>
            Conectando familias con el mejor cuidado infantil<br>
            <em>Este es un correo automático, por favor no respondas a este mensaje.</em>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
