# DEVREADER

=== DEVREADER PROJECT AUDIT ===
Project: /home/marshall/projects/brainy-builds

=== FILE STRUCTURE ===
/home/marshall/projects/brainy-builds/app/\(auth\)/_layout.tsx
/home/marshall/projects/brainy-builds/app/_layout.tsx
/home/marshall/projects/brainy-builds/backend/Dockerfile
/home/marshall/projects/brainy-builds/backend/package.json
/home/marshall/projects/brainy-builds/backend/prisma/schema.prisma
/home/marshall/projects/brainy-builds/backend/src/middleware/auth.ts
/home/marshall/projects/brainy-builds/backend/src/routes/auth.ts
/home/marshall/projects/brainy-builds/backend/src/server.ts
/home/marshall/projects/brainy-builds/docker-compose.yml
/home/marshall/projects/brainy-builds/.gitignore
/home/marshall/projects/brainy-builds/README.md

=== PACKAGE.JSON ===
Not found

=== EXISTING FILE CONTENTS ===
--- app/_layout.tsx ---
import { Slot } from 'expo-router';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}

=== SUMMARY ===
Files found: 1
Project path: /home/marshall/projects/brainy-builds
Use the above EXACT file contents and structure when building. Do not assume anything not shown above.

---

# BACKEND

# 🚀 STAGE 13: ERROR HANDLING & LOGGING - AUTO BUILD

Building error handling and logging system...

---EXECUTION PLAN---
COMMANDS:
cd /home/marshall/projects/brainy-builds/backend && npm install winston uuid @types/uuid

FILES:
/home/marshall/projects/brainy-builds/backend/src/utils/ApiError.ts
export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, code: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, code = 'VALIDATION_ERROR') {
    super(400, message, code);
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string, code = 'AUTHENTICATION_ERROR') {
    super(401, message, code);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string, code = 'FORBIDDEN') {
    super(403, message, code);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, code = 'NOT_FOUND') {
    super(404, message, code);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string, code = 'CONFLICT') {
    super(409, message, code);
  }
}

export class ServerError extends ApiError {
  constructor(message: string, code = 'SERVER_ERROR') {
    super(500, message, code, false);
  }
}

/home/marshall/projects/brainy-builds/backend/src/utils/logger.ts
import winston from 'winston';
import path from 'path';

const logDir = path.join(__dirname, '../../logs');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'brainy-builds-api' },
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;

/home/marshall/projects/brainy-builds/backend/src/utils/apiResponse.ts
import { Response } from 'express';

interface ApiResponseData {
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta: {
    timestamp: string;
    requestId?: string;
  };
}

export const sendSuccess = (
  res: Response,
  data: any,
  statusCode = 200,
  requestId?: string
): Response => {
  const response: ApiResponseData = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  code: string,
  message: string,
  statusCode = 500,
  details?: any,
  requestId?: string
): Response => {
  const response: ApiResponseData = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
  };
  return res.status(statusCode).json(response);
};

/home/marshall/projects/brainy-builds/backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { sendError } from '../utils/apiResponse';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = (req as any).id;

  if (err instanceof ApiError) {
    logger.error({
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
      requestId,
      path: req.path,
      method: req.method,
      ip: req.ip,
      userId: (req as any).userId,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    });

    sendError(
      res,
      err.code,
      err.message,
      err.statusCode,
      process.env.NODE_ENV !== 'production' ? { stack: err.stack } : undefined,
      requestId
    );
    return;
  }

  logger.error({
    message: err.message || 'Internal server error',
    requestId,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: (req as any).userId,
    stack: err.stack,
  });

  sendError(
    res,
    'INTERNAL_SERVER_ERROR',
    process.env.NODE_ENV !== 'production'
      ? err.message
      : 'An unexpected error occurred',
    500,
    process.env.NODE_ENV !== 'production' ? { stack: err.stack } : undefined,
    requestId
  );
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const requestId = (req as any).id;
  logger.warn({
    message: 'Route not found',
    path: req.path,
    method: req.method,
    requestId,
  });

  sendError(
    res,
    'ROUTE_NOT_FOUND',
    `Cannot ${req.method} ${req.path}`,
    404,
    undefined,
    requestId
  );
};

/home/marshall/projects/brainy-builds/backend/src/middleware/requestLogger.ts
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = uuidv4();
  (req as any).id = requestId;

  const startTime = Date.now();

  logger.info({
    message: 'Incoming request',
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';

    logger.log(logLevel, {
      message: 'Request completed',
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });

  next();
};

/home/marshall/projects/brainy-builds/backend/src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import { generalLimiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(requestLogger);
app.use(generalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    requestId: (req as any).id 
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});

/home/marshall/projects/brainy-builds/backend/src/routes/auth.ts
import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { authLimiter } from '../middleware/rateLimiter';
import { authenticateToken } from '../middleware/auth';
import { ValidationError, AuthenticationError, ConflictError } from '../utils/ApiError';
import { sendSuccess } from '../utils/apiResponse';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
];

router.post(
  '/register',
  authLimiter,
  validateRegistration,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Invalid input', 'INVALID_INPUT');
      }

      const { email, password } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new ConflictError('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword },
      });

      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id, type: 'refresh' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      await prisma.session.create({
        data: {
          userId: user.id,
          refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      sendSuccess(
        res,
        {
          message: 'User created successfully',
          accessToken,
          refreshToken,
          user: { id: user.id, email: user.email },
        },
        201,
        (req as any).id
      );
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/login',
  authLimiter,
  validateLogin,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Invalid input');
      }

      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new AuthenticationError('Invalid credentials');
      }

      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id, type: 'refresh' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      await prisma.session.create({
        data: {
          userId: user.id,
          refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      sendSuccess(
        res,
        {
          message: 'Login successful',
          accessToken,
          refreshToken,
          user: { id: user.id, email: user.email },
        },
        200,
        (req as any).id
      );
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/refresh',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new ValidationError('Refresh token required');
      }

      const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
      const session = await prisma.session.findUnique({
        where: { refreshToken },
      });

      if (!session || session.expiresAt < new Date()) {
        throw new AuthenticationError('Invalid or expired refresh token');
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      const newAccessToken = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      const newRefreshToken = jwt.sign(
        { userId: user.id, type: 'refresh' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      await prisma.session.delete({ where: { refreshToken } });
      await prisma.session.create({
        data: {
          userId: user.id,
          refreshToken: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      sendSuccess(
        res,
        {
          message: 'Token refreshed successfully',
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        200,
        (req as any).id
      );
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/me',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const user = await prisma.user.findUnique({
        where: { id: userId

---

# FRONTEND

# 🚀 AUTO-BUILD MODE: BRAINY BUILDS

Understood. I'll build everything automatically without asking for confirmation.

---

## 🎯 STAGE 13: ERROR HANDLING & LOGGING SYSTEM

Building now...

---EXECUTION PLAN---
COMMANDS:
cd /home/marshall/projects/brainy-builds/backend && npm install winston

FILES:
/home/marshall/projects/brainy-builds/backend/src/utils/ApiError.ts
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message);
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication failed') {
    super(401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Access forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Resource conflict') {
    super(409, message);
  }
}

export class ServerError extends ApiError {
  constructor(message: string = 'Internal server error') {
    super(500, message);
  }
}

/home/marshall/projects/brainy-builds/backend/src/utils/logger.ts
import winston from 'winston';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'brainy-builds-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: devFormat,
  }));
}

export default logger;

/home/marshall/projects/brainy-builds/backend/src/utils/apiResponse.ts
import { Response } from 'express';

interface ApiResponseData {
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
  };
  meta: {
    timestamp: string;
    requestId?: string;
  };
}

export const successResponse = (res: Response, data: any, statusCode: number = 200) => {
  const response: ApiResponseData = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
  return res.status(statusCode).json(response);
};

export const errorResponse = (res: Response, message: string, statusCode: number = 500, code: string = 'ERROR') => {
  const response: ApiResponseData = {
    success: false,
    error: {
      code,
      message,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
  return res.status(statusCode).json(response);
};

/home/marshall/projects/brainy-builds/backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = false;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  logger.error({
    message: err.message,
    statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: (req as any).user?.id,
  });

  const response: any = {
    success: false,
    error: {
      code: err.name || 'ERROR',
      message: isOperational ? message : 'Internal server error',
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
};

/home/marshall/projects/brainy-builds/backend/src/middleware/requestLogger.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };

    if (res.statusCode >= 400) {
      logger.warn(logData);
    } else {
      logger.info(logData);
    }
  });

  next();
};

/home/marshall/projects/brainy-builds/backend/src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import { generalLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import logger from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(requestLogger);
app.use(generalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});

/home/marshall/projects/brainy-builds/backend/src/routes/auth.ts
import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { successResponse } from '../utils/apiResponse';
import { ValidationError, AuthenticationError, ConflictError } from '../utils/ApiError';

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  return { accessToken, refreshToken };
};

router.post(
  '/register',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword },
      });

      const { accessToken, refreshToken } = generateTokens(user.id);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await prisma.session.create({
        data: {
          userId: user.id,
          refreshToken,
          expiresAt,
        },
      });

      return successResponse(res, {
        message: 'User created successfully',
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
        },
      }, 201);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new AuthenticationError('Invalid email or password');
      }

      const { accessToken, refreshToken } = generateTokens(user.id);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await prisma.session.create({
        data: {
          userId: user.id,
          refreshToken,
          expiresAt,
        },
      });

      return successResponse(res, {
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(session.userId);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.delete({ where: { refreshToken } });
    await prisma.session.create({
      data: {
        userId: session.userId,
        refreshToken: newRefreshToken,
        expiresAt,
      },
    });

    return successResponse(res, {
      message: 'Token refreshed successfully',
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', authenticateToken, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await prisma.session.deleteMany({
        where: {
          refreshToken,
          userId: (req as any).user.userId,
        },
      });
    }

    return successResponse(res, { message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    return successResponse(res, {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        profile: user.profile,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

/home/marshall/projects/brainy-builds/backend/src/routes/profile.ts
import { Router } from 'express';
import { body } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { successResponse } from '../utils/apiResponse';
import { NotFoundError, ConflictError } from '../utils/ApiError';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

router.post(
  '/',
  [
    body('name').notEmpty().trim(),
    body('age').isInt({ min: 5, max: 100 }),
    body('grade').notEmpty().trim(),
    body('learningGoals').optional().trim(),
    body('bio').optional().trim(),
    body('profileImage').optional().isURL(),
    body('preferences').optional().isObject(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const userId = (req as any).user.userId;
      const { name, age, grade, learningGoals, bio, profileImage, preferences } = req.body;

      const existingProfile = await prisma.profile.findUnique({
        where: { userId },
      });

      if (existingProfile) {
        throw new ConflictError('Profile already exists for this user');
      }

      const profile = await prisma.profile.create({
        data: {
          userId,
          name,
          age,
          