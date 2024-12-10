'use client'
import React from 'react';
import Image from 'next/image';
import Me from '../components/me/me';
import WithAuth from '@/app/login/components/withAuth';
import Link from 'next/link';

const HeaderAdmin = () => {
   
  
    return (
      
            <div className="bg-dark text-white p-4">
                  <div className="container-fluid d-flex justify-content-between align-items-center">
                  <div>
                    <Link href="/">
                    <Image src="/images/TBC.png" alt="logo" width={50} height={50} />
                    </Link>
                    </div>
               <div>
                <div><b><Me/></b></div>
                <div><b><WithAuth/></b></div>
                </div>
            </div>
        </div>
    )
}

export default HeaderAdmin;

