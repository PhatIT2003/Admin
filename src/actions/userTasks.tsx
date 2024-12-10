'use server'
import { BASE_URL } from '@/Constants/infoApi'
import { revalidateTag } from 'next/cache'

export const handleCreateUserTaskAction = async (data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/admin/collectionTask/${data.userId}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
        },  
    })
    revalidateTag("list-tasks")
    return await res.json()
}

export const handleUpdateUserTaskAction = async (data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/admin/collectionTask/${data.userId}/${data.taskId}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    revalidateTag("list-tasks")
    return await res.json()
}

export const handleDeleteUserTaskAction = async (data: any, token: string) => {
        const res = await fetch(`${BASE_URL}/admin/collectionTask/${data.userId}/${data.id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    revalidateTag("list-tasks")
    return await res.json()
}
