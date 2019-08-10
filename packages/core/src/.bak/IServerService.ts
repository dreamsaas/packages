import { listenerCount } from "cluster";

export interface IServerService{
    name:string
    server:any
    listen(port:number): Promise<any>
}