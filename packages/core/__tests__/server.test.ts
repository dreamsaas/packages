import {createServer} from '../src/server'
import {Server, Service} from '../src/types'
import * as path from 'path';
import { Action } from '../src/plugins/hooks/action';

describe('Core Server', ()=>{
    it('should instantiate', async () => {
        const server = await createServer({})
        expect(true).toBe(true)
    })

    it('should include core plugins', async () => {
        const server = await createServer({})
        const pluginNames = server.plugins.map(plugin=>plugin.id)
        expect(pluginNames).toContain('services')
        expect(pluginNames).toContain('hooks')
        expect(pluginNames).toContain('runnable')
        expect(pluginNames).toContain('external-plugin-loader')
    })

    it('should add object service', async ()=>{
        const server = await createServer({})
        server.services.addService({id:'myservice', func:(thing)=>thing})
        const service = server.services.getService('myservice')
        expect(service.func('hello')).toBe('hello')
    })

    it('should add Class service', async ()=>{
        const server = await createServer({})
        class MyClassService implements Service{
            id = 'myservice'
            func(thing){
                return thing
            }
        }

        server.services.addService(new MyClassService())
        const service = server.services.getService('myservice')
        expect(service.func('hello')).toBe('hello')
    })

    it('should throw when adding service without id ', async ()=>{
        const server = await createServer({})
        //@ts-ignore
        class MyClassService implements Service{
        }
        //@ts-ignore
        expect(()=>server.services.addService(new MyClassService())).toThrow()
    })

    it('should throw when adding services with duplicate ids ', async ()=>{
        const server = await createServer({})
        
        class MyClassService implements Service{
            id = 'test'
        }
        server.services.addService(new MyClassService())

        expect(()=>server.services.addService(new MyClassService())).toThrow()
    })

    it('should contain default hooks', async()=>{
        const server = await createServer({})
        const hooks = server.hooks.getHooks()
        const hookIds = hooks.map(hook=>hook.id)
        expect(hookIds).toContain('SERVER_BEFORE_START')
        expect(hookIds).toContain('SERVER_START')
        expect(hookIds).toContain('SERVER_AFTER_START')
        expect(hookIds).toContain('SERVER_BEFORE_STOP')
        expect(hookIds).toContain('SERVER_STOP')
        expect(hookIds).toContain('SERVER_AFTER_STOP')
        expect(hookIds).toContain('PLUGINS_BEFORE_LOAD')
        expect(hookIds).toContain('PLUGINS_AFTER_LOAD')
    })

    it('should be able to add hook', async()=>{
        const server = await createServer({})
        server.hooks.addHook({id:'myhook'})
        const hook = server.hooks.getHook('myhook')
        expect(hook.id).toBe('myhook')
    })
    it('should be able to programmatically add hook action', async()=>{
        const server = await createServer({})
        server.hooks.addHook({id:'myhook'})
        server.hooks.addAction({
            id:'doubleAction',
            exportName:'doubleAction',
            filePath:path.join(__dirname,'./assets/action-example.ts')
        })
        server.hooks.addHookAction('myhook',{id:'doubleAction'})

        const result = await server.hooks.runHook('myhook', 1)
        expect(result).toBe(2)
    })

    it('should be able to add hook action from function reference',async()=>{
        const server = await createServer({})
        server.hooks.addHook({id:'myhook'})
        server.hooks.addAction({id:'doubleAction', handler:(value, server)=>(value+value)})
        server.hooks.addHookAction('myhook',{id:'doubleAction'})

        const result = await server.hooks.runHook('myhook', 1)
        expect(result).toBe(2)
    })
    it('should be able to add hook action using shorthand',async()=>{
        const server = await createServer({})
        server.hooks.addHook({id:'myhook'})
        server.hooks.addHookAction('myhook',{
            id:'doubleAction',
            exportName:'doubleAction',
            filePath:path.join(__dirname,'./assets/action-example.ts')
        })
        const result = await server.hooks.runHook('myhook', 1)
        
        expect(result).toBe(2)
    })

    it('should be able to add hook action using shorthand from function refrence',async()=>{
        const server = await createServer({})
        server.hooks.addHook({id:'myhook'})
        server.hooks.addHookAction('myhook',{
            id:'doubleAction',
            handler:(value, server)=>value+value
        })
        const result = await server.hooks.runHook('myhook', 1)
        expect(result).toBe(2)
    })

    it('should be able to add action multiple times',async()=>{
        const server = await createServer({})
        server.hooks.addHook({id:'myhook'})
        server.hooks.addHookAction('myhook',{
            id:'doubleAction',
            handler:(value, server)=>value+value
        })
        server.hooks.addHookAction('myhook',{id:'doubleAction'})
        const result = await server.hooks.runHook('myhook', 1)
        expect(result).toBe(4)
    })


    it('should automatically create hooks when none registered under name',async()=>{
        const server = await createServer({})
        server.hooks.addHookAction('myhook',{
            id:'doubleAction',
            handler:(value, server)=>value+value
        })
        const result = await server.hooks.runHook('myhook', 1)
        expect(result).toBe(2)
    })

    it('should load plugin from external source', async ()=>{
        const server = await createServer({
            plugins:[{path:path.join(__dirname,'./assets/external.plugin.ts')}]
        })
        // @ts-ignore
        expect(server.myplugin.prop).toBe('has-stuff')
    })

    it('should pass options to external plugin', async ()=>{
        const server = await createServer({
            plugins:[{path:path.join(__dirname,'./assets/external.plugin.ts'), options:{content:'content'}}]
        })
        // @ts-ignore
        expect(server.myplugin.getContent()).toBe('content')
    })

    it('should pass options to local plugin', async ()=>{
        const server = await createServer({
            plugins:[
                {id:'myplugin', options:{content:'content'}}
            ]
        })
        server.use(new class MyPlugin{
            id="myplugin"
            created(server, options){
                server.myplugin = {
                    getContent(){return options.content}
                }
            }
        })
        // @ts-ignore
        expect(server.myplugin.getContent()).toBe('content')
    })
    it('should allow for no setup function in a plugin', async ()=>{
        const server = await createServer({
            plugins:[
                {id:'myplugin', options:{content:'content'}}
            ]
        })
        server.use(new class MyPlugin{
            id="myplugin"
        })
    })

    it('should import config hooks registration', async ()=>{
        const server = await createServer({
            hooks:{
                myHook:{}
            }
        })

        const hook = server.hooks.getHook('myHook')
        expect(hook.id).toBe('myHook')
    })

    it('should import config hooks actions', async ()=>{
        const server = await createServer({
            hooks:{
                myHook:{
                    actions:[{actionId:'the action'}]
                }
            }
        })
        const hook = server.hooks.getHook('myHook')
        expect(hook.actions[0]).not.toBeUndefined()
        expect(hook.actions[0].actionId).toBe('the action')
    })

    it('should import config hooks actions options', async ()=>{
        const server = await createServer({
            hooks:{
                myHook:{
                    actions:[{actionId:'the action', options:{opt:true}}]
                }
            }
        })
        const hook = server.hooks.getHook('myHook')
        expect(hook.actions[0].options).toMatchObject({opt:true})
    })

    it('should pass config imported hook action options to actions', async ()=>{
        const server = await createServer({
            hooks:{
                myHook:{
                    actions:[{actionId:'the action', options:{opt:'custom option'}}]
                }
            }
        })

        server.hooks.addHookAction('myHook', new Action({id:'the action', handler(value, server, options){
            return options
        }}))

        const options = await server.hooks.runHook('myHook')
        expect(options.opt).toBe('custom option')
    })
})