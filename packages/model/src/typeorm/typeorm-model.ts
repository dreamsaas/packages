import {
  Entity,
  Connection,
  Repository,
  FindManyOptions,
  DeepPartial,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  FindConditions
} from 'typeorm'
import { IModel, IQuery, ModelSchema } from '../types'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

const isDefined = value => typeof value !== 'undefined'
const objectMap = (object, callback) => {
  const newObject = {}
  Object.keys(object).forEach(key => {
    newObject[key] = callback(key, object[key])
  })
  return newObject
}
const convertWhereObjectToTypeorm = whereObject => {
  if (isDefined(whereObject.equals)) return whereObject.equals

  if (isDefined(whereObject.notEquals)) return Not(whereObject.equals)

  if (isDefined(whereObject.greaterThan))
    return MoreThan(whereObject.greaterThan)

  if (isDefined(whereObject.greaterThanEquals))
    return MoreThanOrEqual(whereObject.greaterThanEquals)

  if (isDefined(whereObject.lessThan)) return LessThan(whereObject.lessThan)

  if (isDefined(whereObject.lessThanEquals))
    return LessThanOrEqual(whereObject.lessThanEquals)
}

export class TypeOrmModel<TEntity, TModelSchema>
  implements IModel<TModelSchema> {
  public connection: Connection
  public repository: Repository<TEntity>

  constructor(public model: ModelSchema, public entity: any) {}

  setConnection(connection: Connection) {
    this.connection = connection
    this.repository = this.connection.getRepository<TEntity>(this.entity)
  }

  async find(options?: IQuery) {
    const typeOrmOptions = options ? this.convertQueries(options) : undefined
    return await this.repository.find(typeOrmOptions)
  }

  async findOne(options: IQuery) {
    const typeOrmOptions = this.convertWhere(options)
    return await this.repository.findOne(typeOrmOptions)
  }

  async create(data: any) {
    const newEntity = this.repository.create(data)
    return await this.repository.save(newEntity)
  }

  async update(options: IQuery, data: any) {
    const typeOrmOptions = this.convertWhere(options)
    const entity = await this.findOne(options)
    // Todo: If entity not found
    // @ts-ignore
    const result = await this.repository.update(typeOrmOptions, data)
    const modifiedEntity = await this.findOne(options)
    return modifiedEntity
  }

  async delete(options: IQuery) {
    const typeOrmOptions = this.convertWhere(options)
    const entity = await this.findOne(options)
    const result = await this.repository.remove(entity)
    return entity
  }

  convertQueries(options: IQuery): FindManyOptions {
    return {
      where: this.convertWhere(options),
      ...(isDefined(options.offset) && { skip: options.offset }),
      ...(isDefined(options.limit) && { take: options.limit }),
      ...(isDefined(options.limit) && { take: options.limit }),
      ...(isDefined(options.order) && { order: options.order })
    }
  }

  convertWhere(options: IQuery): FindConditions<TEntity> {
    return {
      ...objectMap(options.where, (key: string, value: any) => {
        if (typeof value === 'object') {
          return convertWhereObjectToTypeorm(value)
        }

        return value
      })
    }
  }
}
