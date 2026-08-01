import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TbCheck, TbUser, TbCamera, TbFileText, TbNotes, TbSettings } from "react-icons/tb";
import { toast } from "../../utils/toast";
import { FormLayout } from "../../components/ui/FormLayout";
import { FormSection } from "../../components/ui/FormSection";

const avatarOptions = [
  { id: "av1", name: "Avatar 1", src: "./avatars/av1.png" },
  { id: "av2", name: "Avatar 2", src: "./avatars/av2.png" },
  { id: "av3", name: "Avatar 3", src: "./avatars/av3.png" },
  { id: "av4", name: "Avatar 4", src: "./avatars/av4.png" },
  { id: "av5", name: "Avatar 5", src: "./avatars/av5.png" },
  { id: "av6", name: "Avatar 6", src: "./avatars/av6.png" },
];

type TabType = "avatar" | "terms" | "notes";

export default function Setting() {
  const [activeTab, setActiveTab] = useState<TabType>("avatar");
  const [selectedAvatar, setSelectedAvatar] = useState("av1");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("userAvatar");
    if (saved) {
      const { avatarId } = JSON.parse(saved);
      setSelectedAvatar(avatarId || "av1");
    }

    const savedTerms = localStorage.getItem("invoiceTerms");
    if (savedTerms) {
      setTermsAndConditions(savedTerms);
    }

    const savedNotes = localStorage.getItem("invoiceNotes");
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const saveAvatar = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    localStorage.setItem("userAvatar", JSON.stringify({ avatarId }));
    toast.success("Avatar updated!");
  };

  const currentAvatar = avatarOptions.find((a) => a.id === selectedAvatar);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save based on active tab
    switch (activeTab) {
      case "terms":
        localStorage.setItem("invoiceTerms", termsAndConditions);
        toast.success("Terms & Conditions saved!");
        break;
      case "notes":
        localStorage.setItem("invoiceNotes", notes);
        toast.success("Notes saved!");
        break;
      default:
        toast.success("Settings saved!");
    }
  };

  const tabs = [
    { id: "avatar" as TabType, label: "Avatar", icon: TbUser },
    { id: "terms" as TabType, label: "Terms & Conditions", icon: TbFileText },
    { id: "notes" as TabType, label: "Notes", icon: TbNotes },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <FormLayout
        title="Settings"
        subtitle="Manage your profile and invoice preferences"
        icon={TbSettings}
        onSubmit={handleSubmit}
        submitLabel={activeTab === "avatar" ? "Save Settings" : `Save ${tabs.find(t => t.id === activeTab)?.label}`}
      >
        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 bg-surface-hover rounded-xl mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-brand shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Avatar Tab */}
        {activeTab === "avatar" && (
          <>
            {/* Current Avatar Preview */}
            <FormSection
              icon={TbCamera}
              title="Current Avatar"
              subtitle="This appears on your profile and header"
            >
              <div className="flex items-center gap-5 p-4 bg-surface-hover rounded-2xl">
                <img
                  src={currentAvatar?.src}
                  alt={currentAvatar?.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                />
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {currentAvatar?.name}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Click an avatar below to change
                  </p>
                </div>
              </div>
            </FormSection>

            {/* Choose Avatar */}
            <FormSection
              icon={TbUser}
              title="Choose Avatar"
              subtitle="Select from available options"
              variant="muted"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {avatarOptions.map((avatar) => (
                  <motion.button
                    key={avatar.id}
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => saveAvatar(avatar.id)}
                    className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                      selectedAvatar === avatar.id
                        ? "border-brand bg-brand-light/10 shadow-md"
                        : "border-border hover:border-brand/50 hover:bg-surface-hover"
                    }`}
                  >
                    <img
                      src={avatar.src}
                      alt={avatar.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <span className="text-xs font-medium text-text-secondary">
                      {avatar.name}
                    </span>
                    {selectedAvatar === avatar.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-brand rounded-full flex items-center justify-center">
                        <TbCheck size={12} className="text-white" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </FormSection>
          </>
        )}

        {/* Terms & Conditions Tab */}
        {activeTab === "terms" && (
          <FormSection
            icon={TbFileText}
            title="Terms & Conditions"
            subtitle="Default terms that will auto-fill on new invoices"
          >
            <div className="space-y-3">
              <textarea
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
                placeholder="Enter your default terms and conditions for invoices..."
                rows={8}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand resize-y transition-all"
              />
              <p className="text-xs text-text-muted">
                These terms will automatically appear when you create a new invoice. You can still modify them per invoice if needed.
              </p>
            </div>
          </FormSection>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <FormSection
            icon={TbNotes}
            title="Notes"
            subtitle="Default notes that will auto-fill on new invoices"
          >
            <div className="space-y-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter your default notes for invoices..."
                rows={8}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand resize-y transition-all"
              />
              <p className="text-xs text-text-muted">
                These notes will automatically appear when you create a new invoice. You can still modify them per invoice if needed.
              </p>
            </div>
          </FormSection>
        )}
      </FormLayout>
    </div>
  );
}