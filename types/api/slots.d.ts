import { Vido } from '../gstc';
import { Slots as VidoSlots } from '@neuronet.io/vido/Slots';
import { ComponentInstance, Component } from '@neuronet.io/vido/vido.d';
export declare type SlotInstances = {
    [key: string]: ComponentInstance[];
};
export interface SlotStorage {
    [key: string]: Component[];
}
export declare class Slots extends VidoSlots {
    private name;
    private subs;
    constructor(name: string, vido: Vido, props: unknown);
    destroy(): void;
    getName(): string;
}
export declare function generateSlots(name: string, vido: Vido, props: unknown): Slots;
//# sourceMappingURL=slots.d.ts.map