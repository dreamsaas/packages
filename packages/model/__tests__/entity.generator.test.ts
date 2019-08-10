import {generateTypeOrmEntityCode} from '../src/typeorm/entity.generator'
import { ModelSchema } from '../src/types';
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
    it('should decorate Entity',()=>{
        const result = generateTypeOrmEntityCode(exampleModel, outputFolder)
        // console.log(result)
        const isFound = result.includes(`@Entity()`)
        expect(isFound).toBe(true)
    })

    it('should name class with typename',()=>{
        const result = generateTypeOrmEntityCode(exampleModel, outputFolder)
        const isFound = result.includes(`export class ${exampleModel.typeName}`)
        expect(isFound).toBe(true)
    })

    it('should contain autoincrementing id',()=>{
        const result = generateTypeOrmEntityCode(exampleModel, outputFolder)
        const isFound = result.includes(`@PrimaryGeneratedColumn()\n    id`)
        expect(isFound).toBe(true)
    })

    it('should correctly add number type',()=>{
        const result = generateTypeOrmEntityCode(exampleModel, outputFolder)
        const isFound = result.includes(`numberTypetest: number`)
        expect(isFound).toBe(true)
    })

    it('should correctly add string type',()=>{
        const result = generateTypeOrmEntityCode(exampleModel, outputFolder)
        const isFound = result.includes(`stringTypeTest: string`)
        expect(isFound).toBe(true)
    })

    it('should correctly apply default values',()=>{
        const result = generateTypeOrmEntityCode(exampleModel, outputFolder)
        const isFound = result.includes(`defaultTest: string = "myname"`)
        expect(isFound).toBe(true)
    })
    
    it('should correctly apply optional ?',()=>{
        const result = generateTypeOrmEntityCode(exampleModel, outputFolder)
        const isFound = result.includes(`optionalTest?: string`)
        expect(isFound).toBe(true)
    })

    it('should correctly apply optional with default',()=>{
        const result = generateTypeOrmEntityCode(exampleModel, outputFolder)
        const isFound = result.includes(`defaultOptionalTest?: string = "myname"`)
        expect(isFound).toBe(true)
    })
})