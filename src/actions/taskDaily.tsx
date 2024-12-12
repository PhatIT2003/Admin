'use server'
import { BASE_URL } from '@/Constants/infoApi'
import { revalidateTag } from 'next/cache'

export const handleCreateTaskDailyAction = async (data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/admin/taskDaily`, {
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

export const handleUpdateTaskDailyAction = async (data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/admin/taskDaily/${data.id}`, {
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

export const handleDeleteTaskDailyAction = async (id: string, token: string) => {
        const res = await fetch(`${BASE_URL}/admin/taskDaily/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    revalidateTag("list-tasks")
    return await res.json()
}
