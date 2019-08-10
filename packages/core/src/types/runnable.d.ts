
declare module "dreamsaas"{
    interface Server{
        start?():Promise<void>
        stop?():Promise<void>
    }
}