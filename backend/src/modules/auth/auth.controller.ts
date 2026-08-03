import type { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { apiResponse } from "../../common/utils/apiResponse";
import { authService } from "./auth.service";
import { setTokenCookie, clearTokenCookie } from "../../common/utils/cookie";
import { AppError } from "../../common/errors/AppError";
import { HTTP_STATUS } from "../../common/constants/httpStatus";

class AuthController {
  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);

    //  Set token in cookie
    setTokenCookie(res, result.token);

    return apiResponse({
      res,
      message: "Login successful",
      data: {
        user: result.user,
      },
    });
  });

  me = asyncHandler(async (req, res) => {
    const profile = await authService.me(req.user!.userId);

    return apiResponse({
      res,
      message: "Profile fetched successfully",
      data: profile,
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.logout(req.user!.userId);

    //  Clear cookie
    clearTokenCookie(res);

    return apiResponse({
      res,
      message: result.message,
    });
  });

  updatePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError({
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        message: "User not authenticated",
      });
    }

    const { currentPassword, newPassword } = req.body;
    await authService.updatePassword(userId, currentPassword, newPassword);

    return apiResponse({
      res,
      message: "Password updated successfully",
      data: null,
    });
  });
}

export const authController = new AuthController();
