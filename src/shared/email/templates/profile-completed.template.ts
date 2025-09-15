export const getProfileCompletedTemplate = (
  userName: string,
  userType: 'nanny' | 'family',
  frontendUrl: string | undefined,
): string => {
  const isNanny = userType === 'nanny';
  const typeText = isNanny ? 'niñera' : 'familia';
  const benefits = isNanny
    ? [
        'Recibir aplicaciones de familias interesadas',
        'Aparecer en los resultados de búsqueda',
        'Acceder a oportunidades exclusivas',
        'Mostrar tus certificaciones y experiencia',
      ]
    : [
        'Buscar y contactar niñeras verificadas',
        'Acceder a perfiles completos y detallados',
        'Comunicarte de forma segura',
        'Gestionar aplicaciones y entrevistas',
      ];

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Perfil Completado - Nannys</title>
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
          background: linear-gradient(135deg, #FFB347 0%, #FF6B9D 50%, #4A90E2 100%);
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
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="stars" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse"><text x="12.5" y="18" font-size="10" fill="%23ffffff" opacity="0.3" text-anchor="middle">⭐</text></pattern></defs><rect width="100" height="100" fill="url(%23stars)"/></svg>') repeat;
          animation: float 30s infinite linear;
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
        
        .celebration-badge {
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
          color: #FFB347;
          font-weight: 600;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .completion-section {
          background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
          padding: 30px;
          border-radius: 20px;
          border: 2px solid #17a2b8;
          margin: 30px 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .completion-section::before {
          content: '🎯';
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 40px;
          opacity: 0.3;
        }
        
        .completion-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #17a2b8 0%, #20c997 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          margin: 0 auto 20px;
          color: white;
          box-shadow: 0 10px 25px rgba(23, 162, 184, 0.3);
        }
        
        .completion-title {
          font-size: 22px;
          font-weight: 700;
          color: #0c5460;
          margin-bottom: 15px;
        }
        
        .completion-message {
          color: #0c5460;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .benefits-section {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 25px;
          border-radius: 15px;
          border: 2px solid #dee2e6;
          margin: 30px 0;
        }
        
        .benefits-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .benefits-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #FFB347 0%, #FF6B9D 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin-right: 15px;
          color: white;
        }
        
        .benefits-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }
        
        .benefits-list {
          list-style: none;
          padding: 0;
        }
        
        .benefits-list li {
          background: white;
          padding: 15px;
          border-radius: 10px;
          border-left: 4px solid #FFB347;
          margin-bottom: 10px;
          position: relative;
          padding-left: 50px;
        }
        
        .benefits-list li::before {
          content: '✨';
          position: absolute;
          left: 15px;
          top: 15px;
          font-size: 18px;
        }
        
        .stats-section {
          background: linear-gradient(135deg, #fff3cd 0%, #fef7e0 100%);
          padding: 25px;
          border-radius: 15px;
          border-left: 4px solid #FFB347;
          margin: 30px 0;
        }
        
        .stats-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          color: #856404;
          font-weight: 700;
          font-size: 18px;
        }
        
        .stats-icon {
          font-size: 24px;
          margin-right: 10px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
          text-align: center;
        }
        
        .stat-item {
          background: white;
          padding: 20px 10px;
          border-radius: 10px;
          border: 2px solid #FFB347;
        }
        
        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #856404;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 12px;
          color: #6c757d;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 1px;
        }
        
        .cta-section {
          text-align: center;
          margin: 40px 0;
          padding: 30px;
          background: linear-gradient(135deg, #FFB347 0%, #FF6B9D 100%);
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
          background: linear-gradient(135deg, #4A90E2 0%, #50C878 100%);
          color: white;
          text-decoration: none;
          border-radius: 30px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 10px 25px rgba(74, 144, 226, 0.3);
          transition: all 0.3s ease;
          border: 2px solid rgba(255,255,255,0.3);
          margin: 0 10px;
        }
        
        .button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(74, 144, 226, 0.4);
        }
        
        .divider {
          height: 3px;
          background: linear-gradient(135deg, #FFB347 0%, #FF6B9D 50%, #4A90E2 100%);
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
          <h1>🎉 ¡Perfil Completado!</h1>
          <div class="celebration-badge">¡Ya estás listo para empezar! 🚀</div>
        </div>

        <!-- Main Content -->
        <div class="content">
          <div class="greeting">¡Felicidades ${userName}! 🎊</div>
          
          <!-- Completion Section -->
          <div class="completion-section">
            <div class="completion-icon">✓</div>
            <div class="completion-title">¡Has completado tu perfil de ${typeText}!</div>
            <div class="completion-message">
              Tu perfil está ahora <strong>100% completo</strong> y listo para conectar 
              con ${isNanny ? 'familias que buscan cuidado infantil' : 'niñeras profesionales'}.
              ¡Es hora de empezar a hacer conexiones increíbles!
            </div>
          </div>

          <!-- Benefits Section -->
          <div class="benefits-section">
            <div class="benefits-header">
              <div class="benefits-icon">🌟</div>
              <div class="benefits-title">Ahora puedes:</div>
            </div>
            
            <ul class="benefits-list">
              ${benefits.map((benefit) => `<li>${benefit}</li>`).join('')}
            </ul>
          </div>

          <div class="divider"></div>

          <!-- Stats Section -->
          <div class="stats-section">
            <div class="stats-header">
              <span class="stats-icon">📊</span>
              Tu Perfil en Números
            </div>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-number">100%</div>
                <div class="stat-label">Completado</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${isNanny ? '5⭐' : '🔍'}</div>
                <div class="stat-label">${isNanny ? 'Calificación' : 'Búsqueda'}</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${isNanny ? '✓' : '💬'}</div>
                <div class="stat-label">${isNanny ? 'Verificado' : 'Comunicación'}</div>
              </div>
            </div>
          </div>

          <!-- Call to Action -->
          <div class="cta-section">
            <div class="cta-text">¡Es momento de comenzar!</div>
            <a href="${frontendUrl}/${isNanny ? 'dashboard' : 'nannies'}" class="button">
              ${isNanny ? '📋 Ver mi Dashboard' : '🔍 Buscar Niñeras'}
            </a>
            <a href="${frontendUrl}/profile" class="button">👤 Ver mi Perfil</a>
          </div>

          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              <strong>💡 Consejo:</strong> Mantén tu perfil actualizado y responde rápidamente<br>
              a los mensajes para obtener los mejores resultados.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; text-align: center; border-top: 3px solid #FFB347;">
          <div style="color: #FFB347; font-weight: 600; font-size: 16px; margin-bottom: 10px;">
            🎯 ¡Estás listo para el éxito!
          </div>
          <div style="color: #666; font-size: 13px; line-height: 1.6;">
            © 2025 Nannys. Todos los derechos reservados.<br>
            Conectando ${isNanny ? 'profesionales del cuidado infantil' : 'familias'} con las mejores oportunidades<br>
            <em>Este es un correo automático, por favor no respondas a este mensaje.</em>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
