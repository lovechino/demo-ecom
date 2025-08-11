export class UserModel {
   private id: string
   private email: string
   private phone : string 
   constructor(id:string,email:string,phone:string){
    this.id = id
    this.email = email
    this.phone = phone
   }
   public getId(): string {
    return this.id
   }
   public getEmail(): string {
    return this.email
   }
   public getPhone(): string {
    return this.phone
   }
   public setEmail(email:string): void {
    this.email = email
   }
   public setPhone(phone:string): void {
    this.phone = phone
   }
   public toJson(): string {
    return JSON.stringify(this)
   }
}

