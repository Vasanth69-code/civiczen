import { Header } from "@/components/header";
import { UserSettingsForm } from "@/components/user-settings-form";

export default function SettingsPage() {
  return (
    <>
      <Header title="settings" />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <UserSettingsForm />
        </div>
      </main>
    </>
  );
}
