import { ModelSchemaField, ModelSchema } from './types'

// located in generated/models
export const generateModelIndexCode = (models: ModelSchema[],outputFolder) => `
${models
  .map(
    model => `import { ${model.typeName}Model } from './${model.name}.model'`
  )
  .join('\n')}

export default {
    ${models.map(model => `${model.typeName}Model`).join(',\n')}
}
`
