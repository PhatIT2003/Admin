'use server'
import { BASE_URL } from '@/Constants/infoApi'
import { revalidateTag } from 'next/cache'

export const handleCreateInviteAction = async (id: string, userId: string, token: string) => {
    const res = await fetch(`${BASE_URL}/admin/invite/${userId}`, {
        method: "POST",
        body: JSON.stringify({id}),
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    revalidateTag("list-invite")
    return await res.json()
}
export const handleDeleteInviteAction = async (id: string, userId: string, token: string) => {
    const res = await fetch(`${BASE_URL}/admin/invite/${userId}`, {
        method: "DELETE",
        body: JSON.stringify({id}),
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    revalidateTag("list-invite")
    return await res.json()
}
