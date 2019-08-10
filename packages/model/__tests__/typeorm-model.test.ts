import { TypeOrmModel } from '../src/typeorm/typeorm-model'
import { ModelSchema } from '../src/types'
import { createConnection } from 'typeorm'
import { generateTypeOrmEntityCode } from '../src/typeorm/entity.generator'
import * as path from 'path'
import * as fs from 'fs'
import { writeFileSync } from '../utils/fs-utils'
const UserModelSchema: ModelSchema = {
  name: 'user',
  typeName: 'User',
  pluralName: 'users',
  type: 'typeorm',
  fields: [
    {
      name: 'id',
      type: 'number',
      typeorm: {
        primaryGeneratedColumn: true
      }
    },
    {
      name: 'name',
      type: 'string',
      default: 'defaultName'
    }
  ]
}

const createSqliteConnection = async () =>
  await createConnection({
    type: 'sqlite',
    name: 'memory',
    database: ':memory:',
    synchronize: true,
    dropSchema: true,
    entities: [__dirname + '/.generated/*.entity.ts']
  })

const generateEntity = (schema: ModelSchema) => {
  const result = generateTypeOrmEntityCode(
    schema,
    path.join(__dirname, './.generated')
  )

  writeFileSync(
    path.join(__dirname, `./.generated/${schema.name}.entity.ts`),
    result
  )
  return require(`./.generated/${schema.name}.entity.ts`)
}

describe('TypeOrm Model', () => {
  it('should create and find', async () => {
    const { User } = generateEntity(UserModelSchema)
    const UserModel = new TypeOrmModel<typeof User, typeof UserModelSchema>(
      UserModelSchema,
      User
    )
    const connection = await createSqliteConnection()
    UserModel.setConnection(connection)

    await UserModel.create({})
    const users = await UserModel.find()
    expect(users[0].id).toBe(1)
    await connection.close()
  })

  it('should findOne', async () => {
    const { User } = generateEntity(UserModelSchema)
    const UserModel = new TypeOrmModel<typeof User, typeof UserModelSchema>(
      UserModelSchema,
      User
    )
    const connection = await createSqliteConnection()
    UserModel.setConnection(connection)

    await UserModel.create({})
    const user = await UserModel.findOne({ where: { id: 1 } })
    expect(user.id).toBe(1)
    await connection.close()
  })

  it('should update', async () => {
    const { User } = generateEntity(UserModelSchema)
    const UserModel = new TypeOrmModel<typeof User, typeof UserModelSchema>(
      UserModelSchema,
      User
    )
    const connection = await createSqliteConnection()
    UserModel.setConnection(connection)

    await UserModel.create({ name: 'oldName' })
    const user = await UserModel.findOne({ where: { id: 1 } })
    const result = await UserModel.update(
      { where: { id: user.id } },
      { name: 'new name' }
    )
    expect(user.id).toBe(1)
    expect(result.name).toBe('new name')
    await connection.close()
  })

  it('should delete', async () => {
    const { User } = generateEntity(UserModelSchema)
    const UserModel = new TypeOrmModel<typeof User, typeof UserModelSchema>(
      UserModelSchema,
      User
    )
    const connection = await createSqliteConnection()
    UserModel.setConnection(connection)

    await UserModel.create({})
    const user = await UserModel.findOne({ where: { id: 1 } })
    expect(user.id).toBe(1)
    await UserModel.delete({ where: { id: user.id } })

    const result = await UserModel.find()
    expect(result.length).toBe(0)
    await connection.close()
  })
})
