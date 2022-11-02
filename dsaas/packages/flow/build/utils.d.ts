import { Dict, ActionInstance } from './types';
export declare const createDict: <T extends {
    id: string;
}>(def: T) => Dict<T>;
export declare const createActionInstance: (instanceConfig: ActionInstance) => Dict<ActionInstance>;
export declare const createValue: (type: string, value: any) => {
    type: string;
    value: any;
};
