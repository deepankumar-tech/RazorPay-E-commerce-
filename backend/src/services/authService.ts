import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export class AuthService {
  static async register(data: {
    email: string;
    password: string;
    name: string;
    role?: 'CUSTOMER' | 'MERCHANT' | 'ADMIN';
    merchantName?: string;
    businessCategory?: string;
  }) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw { statusCode: 409, message: 'User with this email already exists', code: 'USER_EXISTS' };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    let merchantId: string | undefined = undefined;

    if (data.role === 'MERCHANT') {
      const newMerchant = await prisma.merchant.create({
        data: {
          name: data.merchantName || `${data.name}'s Store`,
          businessCategory: data.businessCategory || 'General E-Commerce',
          supportEmail: data.email,
        },
      });
      merchantId = newMerchant.id;

      // Create default Merchant Rules
      await prisma.merchantRule.create({
        data: {
          merchantId: newMerchant.id,
          maxTransactionAmount: 5000,
          maxDiscountPercent: 10,
          maxUpsellAmount: 1500,
          requireCustomerConfirmation: true,
          allowAutoCartCreation: true,
          allowAiCampaignGeneration: true,
        },
      });
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || 'CUSTOMER',
        merchantId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        merchantId: true,
        createdAt: true,
      },
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      merchantId: user.merchantId,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      merchantId: user.merchantId,
    });

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { user, accessToken, refreshToken };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw { statusCode: 401, message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' };
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      merchantId: user.merchantId,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      merchantId: user.merchantId,
    });

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  static async refresh(token: string) {
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      throw { statusCode: 401, message: 'Invalid or expired refresh token', code: 'INVALID_REFRESH_TOKEN' };
    }

    const storedToken = await prisma.refreshToken.findUnique({ where: { token } });
    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      throw { statusCode: 401, message: 'Refresh token revoked or expired', code: 'TOKEN_REVOKED' };
    }

    // Token rotation: Revoke old token and generate new ones
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      merchantId: payload.merchantId,
    });

    const newRefreshToken = generateRefreshToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      merchantId: payload.merchantId,
    });

    await prisma.refreshToken.create({
      data: {
        userId: payload.userId,
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  static async logout(token: string) {
    if (token) {
      await prisma.refreshToken.updateMany({
        where: { token },
        data: { revoked: true },
      });
    }
    return true;
  }

  static async updateProfile(userId: string, data: { name?: string; email?: string; password?: string }) {
    const updateData: any = {};
    if (data.name) updateData.name = data.name.trim();
    if (data.email) updateData.email = data.email.trim();
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 12);
    }
    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        merchantId: true,
        createdAt: true,
      },
    });
    return updated;
  }
}
