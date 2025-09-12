
"use client";

import { Header } from "@/components/header";
import { UsersTable } from "@/components/users-table";
import { useUser } from "@/context/user-context";

export default function AllUsersPage() {
  const { users } = useUser();
  
  return (
    <>
      <Header title="Users" />
      <main className="flex-1 p-4 md:p-6">
        <UsersTable users={users} />
      </main>
    </>
  );
}
