import { Container, ContainerOptions } from './container'

export class ContainerService {
  private containers: Container[] = []

  addContainer(container: ContainerOptions) {
    if (this.getContainer(container.id))
      throw new Error('Server cannot accept containers with duplicate ids')
    const newContainer = new Container(container)
    this.containers = this.containers.concat(newContainer)

    return newContainer
  }

  getContainer(id: string) {
    return this.containers.find(container => container.id === id)
  }

  getContainers() {
    return this.containers
  }
}
