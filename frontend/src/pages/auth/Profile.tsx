import { useState, useEffect } from "react";
import {
  TbUser,
  TbMail,
  TbShield,
  TbEdit,
  TbLock,
  TbX,
  TbCheck,
} from "react-icons/tb";
import { useAuthStore } from "../../store/authStore";
import { FormField } from "../../components/ui/FormField";
import { Button } from "../../components/ui/ButtonProps";
import { useUpdateUser } from "../../features/hooks/useUser";
import { Skeleton } from "../../components/ui/SkeletonCard";
import { ChangePassword } from "../../components/layout/ChangePassword";
import { updateProfileSchema } from "@invoice/shared";

type ProfileFormData = {
  name: string;
  email: string;
};

export default function Profile() {
  const { user } = useAuthStore();
  const { mutate: updateUser, isPending } = useUpdateUser();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  const validate = (): boolean => {
    const result = updateProfileSchema.shape.body.safeParse(formData);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    updateUser(
      { id: user?.id!, data: formData },
      {
        onSuccess: () => {
          setIsEditing(false);
          setErrors({});
        },
      },
    );
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || "", email: user?.email || "" });
    setErrors({});
    setIsEditing(false);
  };

  const handleFieldChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
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

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 p-4">
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div>
            <Skeleton className="h-6 w-32 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-[200px] w-full rounded-2xl" />
        <Skeleton className="h-[100px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white">
            <TbUser size={20} />
          </div>
          Profile
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Manage your account information
        </p>
      </div>

      {/* Account Information Card */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
              <TbUser size={18} className="text-brand" />
            </div>
            <div>
              <h2 className="font-semibold text-text-primary">
                Account Information
              </h2>
              <p className="text-xs text-text-muted">
                {isEditing
                  ? "Edit your details below"
                  : "Your personal details"}
              </p>
            </div>
          </div>
          {!isEditing && !isChangingPassword && (
            <Button
              variant="secondary"
              size="sm"
              icon={TbEdit}
              onClick={() => setIsEditing(true)}
              type="button"
            >
              Edit
            </Button>
          )}
        </div>

        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <FormField
                label="Full Name"
                icon={TbUser}
                required
                error={errors.name}
              >
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  placeholder="Enter your name"
                  className={`w-full pl-11 pr-4 py-3 bg-surface-hover rounded-xl text-sm text-text-primary placeholder:text-text-muted border-2 transition-all ${
                    errors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-transparent focus:border-brand/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                  }`}
                />
              </FormField>

              <FormField
                label="Email Address"
                icon={TbMail}
                required
                error={errors.email}
              >
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full pl-11 pr-4 py-3 bg-surface-hover rounded-xl text-sm text-text-primary placeholder:text-text-muted border-2 transition-all ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-transparent focus:border-brand/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                  }`}
                />
              </FormField>

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
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-surface-hover rounded-xl">
                <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center shrink-0">
                  <TbUser size={20} className="text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-muted">Full Name</p>
                  <p className="text-sm font-semibold text-text-primary">
                    {formData.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-surface-hover rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <TbMail size={20} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-muted">Email Address</p>
                  <p className="text-sm font-semibold text-text-primary">
                    {formData.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Section */}
      {isChangingPassword ? (
        <div className="mt-6">
          <ChangePassword
            onCancel={() => {
              setIsChangingPassword(false);
            }}
          />
        </div>
      ) : (
        !isEditing && (
          <>
            {/* Account Details Card */}
            <div className="mt-6 bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TbShield size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-text-primary">
                      Account Details
                    </h2>
                    <p className="text-xs text-text-muted">
                      Your role and permissions
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 p-4 bg-surface-hover rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <TbShield size={20} className="text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-muted">Role</p>
                    <p className="text-sm font-semibold text-text-primary">
                      {user.role || "Admin"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password Button */}
            <div className="mt-6 flex justify-center">
              <Button
                variant="secondary"
                icon={TbLock}
                onClick={() => setIsChangingPassword(true)}
                type="button"
                className="w-full sm:w-auto"
              >
                Change Password
              </Button>
            </div>
          </>
        )
      )}
    </div>
  );
}
