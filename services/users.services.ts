import publicApi from "@/lib/publicApi"
import { LoginModel } from "@/models/login.model"
import { UserModel } from "@/models/user.model"
import { LoginType } from "@/types/user.types"

export class UserServices {
    async login(email:string,password:string) : Promise<LoginModel>{
        const res: LoginType = await publicApi
            .post("/auth/signin", { email : email, password : password })
            .then((data) => data.data)
            .catch((err) => { throw new Error(err) })

        const user = new UserModel(res.user.id, res.user.email, res.user.phone)
        return new LoginModel(res.access_token, res.refresh_token, user)
    }
    async refreshToken(refresh_token:string) : Promise<LoginModel>{
        const res: LoginType = await publicApi
            .post("/auth/refresh", { refresh_token : refresh_token })
            .then((data) => data.data)
            .catch((err) => { throw new Error(err) })
        const user = new UserModel(res.user.id, res.user.email, res.user.phone)
        return new LoginModel(res.access_token, res.refresh_token, user)
    }
}