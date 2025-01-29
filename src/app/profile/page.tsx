"use client"

import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-4">
        <div>
            <Navbar />
        </div>
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        {/* Contenu de la page profil */}
    </div>
  );
}