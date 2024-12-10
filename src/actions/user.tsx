
'use server'
import { BASE_URL } from '@/Constants/infoApi'
import { revalidateTag } from 'next/cache'

export const handleCreateUserAction = async (data: any, token: string) => {

    const res = await fetch(`${BASE_URL}/admin/members`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
             'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
        },  
    })
    revalidateTag("list-users")
    return await res.json()
}

export const handleUpdateUserAction = async (data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/admin/members/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    revalidateTag("list-users")
    return await res.json()
}

export const handleDeleteUserAction = async (id: string, token: string) => {
    const res = await fetch(`${BASE_URL}/admin/members/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    revalidateTag("list-users")
    return await res.json();
}
