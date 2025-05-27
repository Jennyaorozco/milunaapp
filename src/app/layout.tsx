'use client'

import { useState } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Session } from '@supabase/supabase-js';
import { useEffect } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mi Luna",
  description: "Aplicación para el seguimiento del ciclo menstrual.",
  generator: "Next.js",
  applicationName: "Mi Luna",
  authors: [{ name: "Mi Luna Team" }],
  keywords: ["menstruación", "ciclo", "salud femenina", "Mi Luna", "seguimiento"],
  themeColor: "#ffe4ed",
  colorScheme: "light",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Obtener sesión activa
    supabaseClient.auth.getSession().then(({ data }) => {
      setSession(data.session);
      console.log("🌙 Sesión actual:", data.session);
    });

    // Escuchar cambios de sesión (login/logout)
    const { data: listener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabaseClient]);

  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} bg-gradient-to-b from-white via-pink-50 to-pink-100 text-pink-900 min-h-screen`}>
        <SessionContextProvider supabaseClient={supabaseClient} initialSession={session}>
          {children}
        </SessionContextProvider>
      </body>
    </html>
  );
}
