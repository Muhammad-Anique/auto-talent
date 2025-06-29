'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { getCurrentUser } from '@/lib/supabase/getCurrentUser';
import type { User } from '@supabase/supabase-js';
import { Loader2Icon } from 'lucide-react';
export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className='fixed top-0 left-0 w-full p-2'>
      <header className="rounded-full w-full px-6 py-4 bg-white shadow-md flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[#5b6949]">
          autotalent
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">Hello, {user.email}</span>
              <Link
                onClick={() => setIsLoading(true)}
                href="/dashboard"
                className="px-4 py-2 bg-[#5b6949] rounded-full text-white text-sm"
              >
                {isLoading ? (
                  <div className='flex items-center space-x-2'>
                  <span>Redirecting {" "}</span>
                    <Loader2Icon className='w-4 h-4 animate-spin' />
                  </div>
                ): 'Dashboard'}
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-[#5b6949] rounded-full text-white text-sm"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className='flex items-center space-x-2'>
              <Link
                href="/signin"
                className="px-4 py-2 bg-[#5b6949] rounded-full hover:bg-blue-600 text-white text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 border border-[#5b6949] rounded-full hover:bg-[#5b6949]/90 hover:text-white text-[#5b6949] text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
""