export const getWelcomeEmailTemplate = (
  userName: string,
  frontendUrl: string | undefined,
): string => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>¡Bienvenido a Nannys!</title>
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
          background: linear-gradient(135deg, #4A90E2 0%, #FF6B9D 50%, #50C878 100%);
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
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="stars" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="%23ffffff" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23stars)"/></svg>') repeat;
          animation: float 20s infinite linear;
          z-index: 1;
        }
        
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-20px, -20px) rotate(360deg); }
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
          font-size: 32px;
          font-weight: 700;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .welcome-badge {
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
        
        .intro-text {
          font-size: 16px;
          color: #555;
          text-align: center;
          margin-bottom: 30px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 20px;
          border-radius: 15px;
          border-left: 4px solid #FF6B9D;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 30px 0;
        }
        
        .feature-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          padding: 20px;
          border-radius: 15px;
          border: 2px solid #e9ecef;
          transition: all 0.3s ease;
          text-align: center;
        }
        
        .feature-icon {
          font-size: 24px;
          margin-bottom: 10px;
          color: #4A90E2;
        }
        
        .feature-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }
        
        .feature-description {
          font-size: 14px;
          color: #666;
          line-height: 1.4;
        }
        
        .cta-section {
          text-align: center;
          margin: 40px 0;
          padding: 30px;
          background: linear-gradient(135deg, #4A90E2 0%, #FF6B9D 100%);
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
          box-shadow: 0 10px 25px rgba(255, 107, 157, 0.3);
          transition: all 0.3s ease;
          border: 2px solid rgba(255,255,255,0.3);
        }
        
        .button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(255, 107, 157, 0.4);
        }
        
        .divider {
          height: 2px;
          background: linear-gradient(135deg, #4A90E2 0%, #FF6B9D 50%, #50C878 100%);
          margin: 30px 0;
          border-radius: 2px;
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
          <h1>¡Bienvenido a Nannys!</h1>
          <div class="welcome-badge">Tu cuenta está lista 🎉</div>
        </div>

        <!-- Main Content -->
        <div class="content">
          <div class="greeting">¡Hola ${userName}! 👋</div>
          
          <div class="intro-text">
            <strong>¡Nos alegra mucho tenerte con nosotros!</strong><br>
            Tu cuenta ha sido creada exitosamente en nuestra plataforma Nannys, 
            donde conectamos familias con niñeras calificadas y de confianza.
          </div>

          <div class="divider"></div>

          <!-- Features Grid -->
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">👨‍👩‍👧‍👦</div>
              <div class="feature-title">Para Familias</div>
              <div class="feature-description">
                Encuentra niñeras verificadas, gestiona aplicaciones y comunícate de forma segura
              </div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">👩‍🏫</div>
              <div class="feature-title">Para Niñeras</div>
              <div class="feature-description">
                Crea tu perfil profesional, recibe ofertas de trabajo y muestra tus certificaciones
              </div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">🛡️</div>
              <div class="feature-title">Seguridad</div>
              <div class="feature-description">
                Perfiles verificados, comunicación segura y referencias validadas
              </div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <div class="feature-title">Fácil de Usar</div>
              <div class="feature-description">
                Interfaz intuitiva, notificaciones en tiempo real y gestión simplificada
              </div>
            </div>
          </div>

          <!-- Call to Action -->
          <div class="cta-section">
            <div class="cta-text">¡Comienza tu experiencia ahora!</div>
            <a href="${frontendUrl}/login" class="button">🚀 Iniciar Sesión</a>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
            <p>💬 ¿Tienes preguntas? Estamos aquí para ayudarte</p>
            <p>📧 Contáctanos en cualquier momento</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; text-align: center; border-top: 3px solid #4A90E2;">
          <div style="color: #4A90E2; font-weight: 600; font-size: 16px; margin-bottom: 10px;">
            ¡Gracias por confiar en Nannys! 💙
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
