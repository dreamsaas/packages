// import { ModelSchema } from "../types";

// const capitalize = (value)=> value.charAt(0).toUpperCase() + value.slice(1)

// const convertToGraphQLType = (value)=>{
//     if(value === 'number')
//         return 'Int'

//     return capitalize(value)
// }
// // Type definitions define the "shape" of your data and specify
// // which ways the data can be fetched from the GraphQL server.
// const generateInputTypes = (models: ModelSchema[])=>models.map(model=>{
//     return `input ${model.typeName}Input {
//     ${model.fields.map(field=>`${field.name}: ${convertToGraphQLType(field.type)}`).join(`
//     `)}
//         }`
// }).join(`
//     `)
// const generateTypes = (models: ModelSchema[])=>models.map((model)=>{
//     return `type ${model.typeName} {
//   ${model.fields.map(field=>`${field.name}: ${convertToGraphQLType(field.type)}`).join(`
//   `)}
//         }`
// }).join(`
//   `)
// const generateQueryTypes = (models: ModelSchema[])=>`type Query {
//     ${models.map(model=>{
//                   return `${model.pluralName}: [${model.typeName}]`
//               }).join(`
//     `)}
// }`
// const generateMutationTypes =  (models: ModelSchema[])=>`type Mutation {
//     ${models.map(model=>{
//                 return `add_${model.pluralName}(data: ${model.typeName}Input!): ${model.typeName}`
//             }).join(`
//     `)}
// }`

// export const generateModelGraphQLTypes = (models: ModelSchema[])=>`
// ${generateInputTypes(models)}
// ${generateTypes(models)}
// ${generateQueryTypes(models)}
// ${generateMutationTypes(models)}
// `