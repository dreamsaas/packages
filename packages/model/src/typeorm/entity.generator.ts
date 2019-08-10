import { ModelSchemaField, ModelSchema } from '../types'

export const generateTypeOrmEntityColumnCode = (field: ModelSchemaField) => {
  if (field.typeorm && field.typeorm.primaryGeneratedColumn) {
    return `@PrimaryGeneratedColumn()\n    ${field.name}: number`
  }

  const fieldName = `${field.name}`
  const fieldType = `${field.type}`
  const defaultValue = typeof field.default !== 'undefined'
    ? ` = ${JSON.stringify(field.default)}`
    : ''
  const optionalFlag = field.optional? '?':''

  return `@Column()\n ${field.name}${optionalFlag}: ${field.type}${defaultValue}`
}

// located in /generated/models/entities
export const generateTypeOrmEntityCode = (model: ModelSchema, outputFolder:string) => `
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"; 

@Entity()
export class ${model.typeName} {
    ${model.fields.map(generateTypeOrmEntityColumnCode).join('\n\n  ')}

}
`
// Located in /generated/models
export const TypeOrmModelCodeGenerator = (model: ModelSchema, outputFolder: string) => `
import { ${model.typeName} } from './entities/${model.name}.entity'
import { TypeOrmModel } from '../../lib/model'

export const ${model.typeName}Model = new TypeOrmModel<${model.typeName}>({}, ${
  model.typeName
})
`