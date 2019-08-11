import { Service } from '@dreamsaas/types'

export interface ContainerOptions {
	id: string
}

export class Container {
	public id: string
	private services = []

	constructor({ id }: ContainerOptions) {
		if (!id) throw new Error('Containers must have a id')

		this.id = id
	}

	/**
	 * Retrieve list of services from the container
	 */
	getServices() {
		return this.services
	}

	/**
	 * Retrieve a specific service by id
	 */
	getService<T extends Service>(id: string): T {
		return this.services.find(service => service.id === id)
	}

	/**
	 * Add a service to the services list.
	 * If the service is a class, it must be instantiated first `new YourService()`
	 */
	addService(service: Service) {
		if (!service.id)
			throw new Error(
				`A service must contain an id(string) property: ${JSON.stringify(
					service
				)}`
			)

		if (this.getService(service.id))
			throw new Error(
				`Containers cannot accept services with duplicate ids: ${service.id}`
			)

		this.services = this.services.concat(service)

		return service
	}
}
