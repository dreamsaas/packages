import { Plugin, Server } from "dreamsaas";
import { ContainerService } from "./container-service";


export class ServicesPlugin implements Plugin{
    public id = 'services'

    containerService: ContainerService;

    created(server: Server){
      server.containerService = new ContainerService()
      server.services = server.containerService.addContainer({
            id: 'services'
          })
    }
  }