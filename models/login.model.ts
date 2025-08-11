import { UserModel } from "./user.model"

export class LoginModel {
    private access_token : string 
    private refresh_token : string 
    private user : UserModel
    constructor(access_token:string,refresh_token:string,user:UserModel){
        this.access_token = access_token
        this.refresh_token = refresh_token
        this.user = user
    }
    public getAccessToken(): string {
        return this.access_token
    }
    public getRefreshToken(): string {
        return this.refresh_token
    }
    public getUser(): UserModel {
        return this.user
    }
    public setAccessToken(access_token:string): void {
        this.access_token = access_token
    }
    public setRefreshToken(refresh_token:string): void {
        this.refresh_token = refresh_token
    }
    public setUser(user:UserModel): void {
        this.user = user
    }
}