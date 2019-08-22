interface iThing {
    id: number;
}
declare class Thing implements iThing {
}
export declare class ProjectController {
    getThing(id: number): Thing;
}
export {};
