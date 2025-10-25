/**
 * Utilitário para logs amigáveis com emojis e cores
 */

// Tipos de log
type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'debug';

// Emojis para cada tipo de log/contexto
const emojis = {
  info: '💡',
  success: '✅',
  warn: '⚠️',
  error: '❌',
  debug: '🔍',
  server: '🚀',
  database: '🗄️',
  user: '👤',
  auth: '🔐',
  escola: '🏫',
  route: '🛣️',
  controller: '🎮',
  service: '⚙️',
  model: '💾',
  aluno: '🧑‍🎓',
  responsavel: '👨‍👩‍👧',
  matricula: '📋',
  boletim: '📊',
  atividade: '📝',
};

// Cores ANSI para o terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Função principal de log
export const log = (
  level: LogLevel,
  message: string,
  context?: string,
  data?: any
): void => {
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const emoji = context ? (emojis[context as keyof typeof emojis] || '📝') : emojis[level];
  let colorCode = '';

  switch (level) {
    case 'info': colorCode = colors.blue; break;
    case 'success': colorCode = colors.green; break;
    case 'warn': colorCode = colors.yellow; break;
    case 'error': colorCode = colors.red; break;
    case 'debug': colorCode = colors.magenta; break;
    default: colorCode = colors.white;
  }

  const contextStr = context && typeof context === 'string' ? ` [${context.toUpperCase()}]` : '';
  const logMessage = `${colorCode}${timestamp} ${emoji}${contextStr} ${message}${colors.reset}`;
  console.log(logMessage);

  if (data) {
    const dataStr = typeof data === 'object' ? JSON.stringify(data, null, 2) : data.toString();
    console.log(`${colors.dim}${dataStr}${colors.reset}`);
  }
};

// Funções específicas para cada nível de log
export const logInfo = (message: string, context?: string, data?: any) =>
  log('info', message, context, data);

export const logSuccess = (message: string, context?: string, data?: any) =>
  log('success', message, context, data);

export const logWarning = (message: string, context?: string, data?: any) =>
  log('warn', message, context, data);

export const logError = (message: string, context?: string, data?: any) =>
  log('error', message, context, data);

export const logDebug = (message: string, context?: string, data?: any) =>
  log('debug', message, context, data);

// ==============================
// CLASSES DE ERRO CUSTOMIZADAS
// ==============================

export abstract class IntegrityError extends Error {
  public readonly code: string;
  public readonly timestamp: Date;

  constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class NotFoundError extends IntegrityError {
  constructor(message: string = 'Entidade não encontrada') {
    super(message, 'NOT_FOUND');
  }
}

export class ConstraintViolationError extends IntegrityError {
  public readonly details: {
    entidade: string;
    id: string;
    dependencias?: Record<string, number>;
  };
  constructor(
    message: string,
    details: { entidade: string; id: string; dependencias?: Record<string, number> }
  ) {
    super(message, 'CONSTRAINT_VIOLATION');
    this.details = details;
  }
}

export class ForbiddenError extends IntegrityError {
  public readonly requiredRole: string[];
  public readonly userRole: string;
  constructor(
    message: string = 'Operação não permitida para este perfil de usuário',
    requiredRole: string[],
    userRole: string
  ) {
    super(message, 'FORBIDDEN');
    this.requiredRole = requiredRole;
    this.userRole = userRole;
  }
}

export class InvalidStateError extends IntegrityError {
  public readonly currentState: string;
  public readonly requiredState: string;
  constructor(
    message: string,
    currentState: string,
    requiredState: string
  ) {
    super(message, 'INVALID_STATE');
    this.currentState = currentState;
    this.requiredState = requiredState;
  }
}

export const isIntegrityError = (error: unknown): error is IntegrityError =>
  error instanceof IntegrityError;

export const mapErrorToHttpResponse = (error: IntegrityError) => {
  switch (error.code) {
    case 'NOT_FOUND':
      return {
        status: 404,
        response: {
          status: 'erro',
          mensagem: error.message,
          codigo: error.code,
          timestamp: error.timestamp,
        },
      };
    case 'CONSTRAINT_VIOLATION':
      const constraintError = error as ConstraintViolationError;
      return {
        status: 400,
        response: {
          status: 'erro',
          mensagem: error.message,
          codigo: error.code,
          detalhes: constraintError.details,
          timestamp: error.timestamp,
        },
      };
    case 'FORBIDDEN':
      const forbiddenError = error as ForbiddenError;
      return {
        status: 403,
        response: {
          status: 'erro',
          mensagem: error.message,
          codigo: error.code,
          detalhes: {
            perfil_usuario: forbiddenError.userRole,
            perfis_requeridos: forbiddenError.requiredRole,
          },
          timestamp: error.timestamp,
        },
      };
    case 'INVALID_STATE':
      const stateError = error as InvalidStateError;
      return {
        status: 400,
        response: {
          status: 'erro',
          mensagem: error.message,
          codigo: error.code,
          detalhes: {
            estado_atual: stateError.currentState,
            estado_requerido: stateError.requiredState,
          },
          timestamp: error.timestamp,
        },
      };
    default:
      return {
        status: 500,
        response: {
          status: 'erro',
          mensagem: 'Erro interno do servidor',
          codigo: 'INTERNAL_ERROR',
          timestamp: new Date(),
        },
      };
  }
};

// Exportação padrão
export default {
  log,
  info: logInfo,
  success: logSuccess,
  warning: logWarning,
  error: logError,
  debug: logDebug,
};