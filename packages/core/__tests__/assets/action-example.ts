export const doubleAction = (value)=>{
    return value + value
}

export const tripleAction = (value)=>{
    return value + value + value
}

export const numberToStringPromise = (value:number)=>new Promise((resolve)=>{
    setTimeout(()=>{
        resolve(value.toString())
    },1)
})

export const rootResponse = ()=>{
    console.log('root response running')
    return 'ok'
}