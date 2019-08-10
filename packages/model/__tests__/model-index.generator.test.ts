import { ModelSchema } from "../src/types";
import {generateModelIndexCode} from '../src/model-index.generator'
import * as path from 'path'


const outputFolder = path.join(__dirname,'./.generated')

const exampleModel: ModelSchema = {
    name: 'user', 
    type: 'typeorm',
    pluralName:'users',
    typeName:'User',
    fields:[
        {
            name:'id',
            type:'number',
            typeorm:{
                primaryGeneratedColumn:true
            },
        },{
            name:'stringTypeTest',
            type:'string'
        },
        {
            name:'numberTypetest',
            type:'number'
        },
        {
            name:'optionalTest',
            type:'string',
            optional:true
        },
        {
            name:'defaultTest',
            type:'string',
            default:'myname'
        },
        {
            name:'defaultOptionalTest',
            type:'string',
            optional:true,
            default:'myname'
        }
    ]
  }
  

describe('entity-generator', ()=>{
    it('should import the Entity',()=>{
        const result = generateModelIndexCode([exampleModel],outputFolder)
        // console.log(result)
        const isFound = result.includes(`import { UserModel } from './user.model'`)
        expect(isFound).toBe(true)
    })

    it('should export the Entity',()=>{
        const result = generateModelIndexCode([exampleModel],outputFolder)
        // console.log(result)
        const isFound = result.includes(`export default {\n    UserModel\n}`)
        expect(isFound).toBe(true)
    })
})