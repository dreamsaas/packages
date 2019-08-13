declare module '@dreamsaas/types' {
  interface Server {
    start?(): Promise<void>
    stop?(): Promise<void>
  }
}
