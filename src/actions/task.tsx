'use server'
import { BASE_URL } from '@/Constants/infoApi'
import { revalidateTag } from 'next/cache'

export const handleCreateTaskAction = async (data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/admin/tasks`, {
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

export const handleUpdateTaskAction = async (data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/admin/tasks/${data.id}`, {
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

export const handleDeleteTaskAction = async (id: string, token: string) => {
        const res = await fetch(`${BASE_URL}/admin/tasks/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    revalidateTag("list-tasks")
    return await res.json()
}
