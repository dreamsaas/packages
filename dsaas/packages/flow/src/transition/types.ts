export interface TransitionDefinition {
  /** from action */
  fromAction: string;
  /** to action */
  toAction: string;
  fromOutput?: string | null;
  toInput?: string | null;
  /**
   * Editor UI properties.
   * This can be deleted for production configs.
   */
  editor?: {
    /** Line that connects outputs to inputs */
    connectorLine: {
      ouputX: number;
      outputY: number;
      inputX: number;
      inputY: number;
    };
  };
}
