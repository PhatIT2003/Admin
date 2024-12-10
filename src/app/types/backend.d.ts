export interface UserInfo {
  id: string
  user_id: string
  first_name: string
  last_name: string
  username: string
  auth_date: string;
  hash: string;
  languageCode: string
  photoUrl: string
  allowsWriteToPm: boolean
  token: number
  inviter: string
  address: string
  createdAt: string
  lastAuthenticated: string
  lastClaim: string
  [key: string]: unknown; 
}
export interface CollectionTask {
  id: string
  stt: number
  name_task: string
  link_task: string
  token: string     
  isCompleted?: boolean
  completedAt?: string
  completedBy?: number
}

export interface ITask{
  id: string
  stt: number
  name_task: string
  link_task: string
  token: number
}
export interface admin {
  id: number
  name: string
  email: string
  password: string
}
export interface IInvite {
  id: string
  user_id: string
  first_name: string
  last_name: string
  token: number
  inviter: string
  photoUrl: string

}
