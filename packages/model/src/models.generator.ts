import { ModelSchema } from './types'
import { generateModelIndexCode } from './model-index.generator'

import {
  generateTypeOrmEntityCode,
  TypeOrmModelCodeGenerator
} from './typeorm/entity.generator'
import { writeFileSync } from '../utils/fs-utils'
import * as path from 'path'
import { TypeOrmModel } from './typeorm/typeorm-model'

const modelGenerator = (model: ModelSchema, outputFolder: string) => {
  if (model.type === 'typeorm') {
    //Build the entities
    const entityCode = generateTypeOrmEntityCode(model, outputFolder)
    const entityPath = path.join(
      outputFolder,
      `typeorm/entities/${model.name}.entity.ts`
    )
    writeFileSync(entityPath, entityCode)
    const entityFile = require(entityPath)
    const entity = entityFile[model.typeName]

    return new TypeOrmModel<typeof entity, typeof model>(model, entity)
  }
}

export const modelsGenerator = (
  models: ModelSchema[],
  outputFolder: string
) => {
  const generatedModels = models.map(entity => {
    return modelGenerator(entity, outputFolder)
  })

  return new Map(
    models.map(entity => {
      return [entity.name, modelGenerator(entity, outputFolder)]
    })
  )
}
