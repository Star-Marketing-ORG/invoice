import { useState } from "react";
import { TbLock, TbEye, TbEyeOff, TbX, TbCheck } from "react-icons/tb";
import { Button } from "../../components/ui/ButtonProps";
import { useUpdatePassword } from "../../features/hooks/useUser";
import { updatePasswordSchema } from "@invoice/shared";

interface ChangePasswordProps {
  onCancel?: () => void;
}

export function ChangePassword({ onCancel }: ChangePasswordProps) {
  const { mutate: updatePassword, isPending } = useUpdatePassword();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validate = (): boolean => {
    const result = updatePasswordSchema.shape.body.safeParse(passwordData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    updatePassword(
      {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      },
      {
        onSuccess: () => {
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setErrors({});
          onCancel?.();
        },
      },
    );
  };

  const handleCancel = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    onCancel?.();
  };

  const handleFieldChange = (
    field: keyof typeof passwordData,
    value: string,
  ) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
            <TbLock size={18} className="text-brand" />
          </div>
          <div>
            <h2 className="font-semibold text-text-primary">Change Password</h2>
            <p className="text-xs text-text-muted">
              Enter your current and new password
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Current Password
              <span className="text-danger ml-1">*</span>
            </label>
            <div className="relative">
              <TbLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  handleFieldChange("currentPassword", e.target.value)
                }
                placeholder="Enter current password"
                className={`w-full pl-11 pr-12 py-3 bg-surface-hover rounded-xl text-sm text-text-primary placeholder:text-text-muted border-2 transition-all ${
                  errors.currentPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-transparent focus:border-brand/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                {showCurrentPassword ? (
                  <TbEyeOff size={16} />
                ) : (
                  <TbEye size={16} />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-danger text-xs mt-1.5 font-medium">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              New Password
              <span className="text-danger ml-1">*</span>
            </label>
            <div className="relative">
              <TbLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) =>
                  handleFieldChange("newPassword", e.target.value)
                }
                placeholder="Enter new password (min 8 characters)"
                className={`w-full pl-11 pr-12 py-3 bg-surface-hover rounded-xl text-sm text-text-primary placeholder:text-text-muted border-2 transition-all ${
                  errors.newPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-transparent focus:border-brand/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                {showNewPassword ? <TbEyeOff size={16} /> : <TbEye size={16} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-danger text-xs mt-1.5 font-medium">
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Confirm New Password
              <span className="text-danger ml-1">*</span>
            </label>
            <div className="relative">
              <TbLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  handleFieldChange("confirmPassword", e.target.value)
                }
                placeholder="Confirm new password"
                className={`w-full pl-11 pr-12 py-3 bg-surface-hover rounded-xl text-sm text-text-primary placeholder:text-text-muted border-2 transition-all ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-transparent focus:border-brand/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                {showConfirmPassword ? (
                  <TbEyeOff size={16} />
                ) : (
                  <TbEye size={16} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-danger text-xs mt-1.5 font-medium">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              className="flex-1"
              icon={TbX}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isPending}
              className="flex-1"
              icon={TbCheck}
            >
              {isPending ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
