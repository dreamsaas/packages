import {} from 'typeorm'


export interface ModelSchemaField {
    name: string
    type: string
    dbType?:string
    default?: any
    optional?: boolean
    typeorm?:{
        primaryGeneratedColumn?: boolean
    }
    to?:(value:any)=>void
    from?:(value:any)=>any
}

export type ModelType = 'typeorm'

export interface ModelSchema {
    name: string
    typeName: string
    pluralName: string
    type: ModelType
    fields: ModelSchemaField[],
    modelCode?:string
}

export interface iQueryMatcher {
    equals: any
    notEquals:any
    greaterThan:any
    greaterThanEquals:any
    lessThan:any
    lessThanEquals:any
}

export interface IQuery {
    where:{
        [key:string]: any | iQueryMatcher
    }
    limit?: number
    offset?: number
    order?: {
        [key:string]: "ASC"|"DESC"
    }
}

export interface IModel<ModelSchema> {
    //DB connection used by the model
    connection?: any
    // Connect
    setConnection(connection:any):void
    find(options : IQuery):Promise<any>
    findOne(options: IQuery):any
    create(data: any): Promise<any>
    update(options: IQuery, data:any):any
    delete(options: IQuery):any
    //Todo: add listener options
}
