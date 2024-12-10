"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Inter } from 'next/font/google'
import StyledComponentsRegistry from '@/lib/antd.registry';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
const inter = Inter({ subsets: ['latin'] })
import './good.css';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Check for token in localStorage
    if (!token) {
      router.push('/login'); // Redirect to login if token is not found
    }
  }, [router]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
