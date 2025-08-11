export interface UserType {
    id: string
    email: string
    phone: string
}

export interface LoginType {
    access_token: string
    refresh_token: string
    user: UserType
}