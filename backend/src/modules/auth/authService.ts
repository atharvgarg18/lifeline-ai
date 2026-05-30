import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { ENV } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { UserModel, IUser } from './User.model';

interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: IUser['role'];
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  tokens: AuthTokens;
}

const generateTokens = (user: IUser): AuthTokens => {
  const payload = { id: user._id, email: user.email, role: user.role };
  const jwtSecret = ENV.JWT_SECRET as Secret;
  const jwtRefreshSecret = ENV.JWT_REFRESH_SECRET as Secret;
  const accessExpiresIn = ENV.JWT_EXPIRY as SignOptions['expiresIn'];
  const refreshExpiresIn = ENV.JWT_REFRESH_EXPIRY as SignOptions['expiresIn'];

  const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: accessExpiresIn });

  const refreshToken = jwt.sign(payload, jwtRefreshSecret, { expiresIn: refreshExpiresIn });

  return { accessToken, refreshToken, expiresIn: Number(ENV.JWT_EXPIRY) };
};

const formatUser = (user: IUser) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

export class AuthService {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const existing = await UserModel.findOne({ email: payload.email.toLowerCase() });
    if (existing) {
      throw new AppError('CONFLICT', 409, 'An account with this email already exists');
    }

    const user = await UserModel.create({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      role: payload.role || 'PATIENT',
    });

    const tokens = generateTokens(user);
    return { user: formatUser(user), tokens };
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const user = await UserModel.findOne({ email: payload.email.toLowerCase() }).select('+password');
    if (!user) {
      throw new AppError('INVALID_CREDENTIALS', 401, 'Invalid email or password');
    }

    const valid = await user.comparePassword(payload.password);
    if (!valid) {
      throw new AppError('INVALID_CREDENTIALS', 401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new AppError('ACCOUNT_INACTIVE', 403, 'Your account has been deactivated');
    }

    const tokens = generateTokens(user);
    return { user: formatUser(user), tokens };
  }

  async getMe(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) throw new AppError('USER_NOT_FOUND', 404, 'User not found');
    return formatUser(user);
  }
}

export const authService = new AuthService();
