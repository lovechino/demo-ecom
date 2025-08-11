import { LoginModel } from "@/models/login.model";
import { UserModel } from "@/models/user.model";
import { UserServices } from "@/services/users.services";

export class UserViewModel {
  private userServices: UserServices;
  public loading = false;
  error: string | null = null;
  loginModel: LoginModel | null = null;
  user: UserModel | null = null;

  constructor() {
    this.userServices = new UserServices();
  }

  async login(email: string, password: string) {
    this.loading = true;
    this.error = null;
    try {
      const result = await this.userServices.login(email, password);
      this.loginModel = result;
      this.user = result.getUser();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      this.error = err;
    } finally {
      this.loading = false;
    }
  }
  async refreshToken(refresh_token:string){
    this.loading = true
    this.error = null
    try{
      const result = await this.userServices.refreshToken(refresh_token)
      this.loginModel = result
      this.user = result.getUser()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(err:any){
      this.error = err
    }finally{
      this.loading = false
    }
  }
}


