declare module 'dreamsaas' {
  interface Server {
    /**
     * Runs the setup functions for all plugins.
     *
     * All plugins are expected to be loaded before this is run.
     */
    setup?(): Promise<void>
  }
}
