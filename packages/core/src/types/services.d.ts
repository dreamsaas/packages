import { ContainerService } from "../plugins/services/container-service";
import { Container } from "../plugins/services/container";
// import {Server} from '../../types'

declare module "dreamsaas"{
    export interface Service {
        id: string
        [name:string]:any
      }
    export interface Server {
        containerService?: ContainerService
        services?: Container
    }
  }