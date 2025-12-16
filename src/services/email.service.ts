import nodemailer from 'nodemailer';
import { logError, logSuccess } from '../utils/logger';

// Configuração do transporter de email
const createTransporter = () => {
  // Se tiver configuração SMTP customizada, usa ela
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true para 465, false para outras portas
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: usa Gmail com OAuth2 ou senha de app
  // Para Gmail, você precisa criar uma "Senha de App" nas configurações da conta Google
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'escolapinguinhodegentec@gmail.com',
      pass: process.env.EMAIL_PASS, // Senha de app do Gmail
    },
  });
};

export interface ContatoFormData {
  nome: string;
  telefone: string;
  email: string;
  mensagem: string;
}

export class EmailService {
  static async enviarEmailContato(dados: ContatoFormData): Promise<boolean> {
    try {
      const transporter = createTransporter();
      const emailDestino = process.env.EMAIL_DESTINO || 'escolapinguinhodegentec@gmail.com';

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"Sistema Pinguinho" <${process.env.EMAIL_USER || 'escolapinguinhodegentec@gmail.com'}>`,
        to: emailDestino,
        replyTo: dados.email, // Permite responder diretamente ao remetente
        subject: `📧 Nova Mensagem de Contato - ${dados.nome}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
              }
              .header {
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                color: white;
                padding: 20px;
                border-radius: 8px 8px 0 0;
                text-align: center;
              }
              .content {
                background: white;
                padding: 30px;
                border-radius: 0 0 8px 8px;
              }
              .info-row {
                margin-bottom: 15px;
                padding: 10px;
                background-color: #f5f5f5;
                border-left: 4px solid #3b82f6;
              }
              .label {
                font-weight: bold;
                color: #3b82f6;
                display: inline-block;
                min-width: 100px;
              }
              .message-box {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                margin-top: 10px;
                border: 1px solid #e0e0e0;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                color: #666;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📧 Nova Mensagem de Contato</h1>
                <p>Escola Pinguinho</p>
              </div>
              <div class="content">
                <p>Você recebeu uma nova mensagem através do formulário de contato do site:</p>
                
                <div class="info-row">
                  <span class="label">Nome:</span>
                  <span>${dados.nome}</span>
                </div>
                
                <div class="info-row">
                  <span class="label">Telefone:</span>
                  <span>${dados.telefone}</span>
                </div>
                
                <div class="info-row">
                  <span class="label">E-mail:</span>
                  <span>${dados.email}</span>
                </div>
                
                <div class="message-box">
                  <strong>Mensagem:</strong>
                  <p style="margin-top: 10px; white-space: pre-wrap;">${dados.mensagem}</p>
                </div>
                
                <div class="footer">
                  <p>Esta mensagem foi enviada automaticamente pelo sistema da Escola Pinguinho.</p>
                  <p>Para responder, use o endereço de e-mail do remetente: <strong>${dados.email}</strong></p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Nova Mensagem de Contato - Escola Pinguinho

Nome: ${dados.nome}
Telefone: ${dados.telefone}
E-mail: ${dados.email}

Mensagem:
${dados.mensagem}

---
Esta mensagem foi enviada automaticamente pelo sistema da Escola Pinguinho.
Para responder, use o endereço de e-mail do remetente: ${dados.email}
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      
      logSuccess('Email de contato enviado com sucesso', 'email', {
        messageId: info.messageId,
        to: emailDestino,
        from: dados.email
      });

      return true;
    } catch (error: any) {
      logError('Erro ao enviar email de contato', 'email', error);
      throw error;
    }
  }
}

export default EmailService;

