import {createServer} from '../src/server'
import * as path from 'path';
import { SettingsService } from '../src/plugins/settings/settings.service';

describe('Settings Plugin', ()=>{
    it('should instantiate', async () => {
        const server = await createServer({})
        expect(true).toBe(true)
    })
    
    it('should add settings service', async()=>{
        const server = await createServer({})
        const settingsService:SettingsService = server.services.getService('settings')
        
        expect(settingsService.id).toBe('settings')
    })
    it('should add settings service to server', async()=>{
        const server = await createServer({})
        expect(server.settings.id).toBe('settings')
    })
    it('should add settings from plugin configuration loaded externally', async()=>{
        const server = await createServer({
            plugins:[{path:path.join(__dirname,'./assets/external.plugin.ts')}]
        })
        await server.setup()

        const setting = server.settings.getSettingConfiguration('mysetting')
        expect(setting.id).toBe('mysetting')
    })
    it('should add settings from plugin configuration loaded after server creation', async()=>{
        const server = await createServer({})
        server.use(new class MyPlugin{
            id='myplugin'
            settings = [{id:'mysetting'}]
        })
        await server.setup()

        const setting = server.settings.getSettingConfiguration('mysetting')
        expect(setting.id).toBe('mysetting')
    })

    it('should return default if no setting is set', async()=>{
        const server = await createServer({})
        server.use(new class MyPlugin{
            id='myplugin'
            settings = [{id:'mysetting', default:'mydefault'}]
        })
        await server.setup()

        const setting = server.settings.getSetting('mysetting')
        expect(setting).toBe('mydefault')
    })
    it('should return saved setting if set', async()=>{
        const server = await createServer({
            settings:{
                mysetting:'savedsetting'
            }
        })
        server.use(new class MyPlugin{
            id='myplugin'
            settings = [{id:'mysetting', default:'mydefault'}]
        })
        await server.setup()

        const setting = server.settings.getSetting('mysetting')
        expect(setting).toBe('savedsetting')
    })

})