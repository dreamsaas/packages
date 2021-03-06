import { Plugin, Server } from '@dreamsaas/types'
import { ContainerService } from './container-service'

export class ServicesPlugin implements Plugin {
	public id = 'services'
	hidden=true

	containerService: ContainerService

	created(server: Server) {
		server.containerService = new ContainerService()
		server.services = server.containerService.addContainer({
			id: 'services'
		})
	}
}
