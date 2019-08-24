import { compileComponent } from './webpack.service'

export default {
	Query: {
		async getComponent(parent, { path }) {
			const file = await compileComponent(path)
			return file
		}
	}
}
