import { Vido } from '../gstc';
import { Slots as VidoSlots } from '@neuronet.io/vido/Slots';
import { ComponentInstance, Component } from '@neuronet.io/vido/vido.d';

export type SlotInstances = {
  [key: string]: ComponentInstance[];
};

export interface SlotStorage {
  [key: string]: Component[];
}

export class Slots extends VidoSlots {
  private name: string;
  private subs = [];

  constructor(name: string, vido: Vido, props: unknown) {
    super(vido, props);
    this.name = name;
    this.subs.push(
      vido.state.subscribe(
        `config.slots.${name}`,
        this.setComponents,
        // execute all neccesary jobs update view and then update slots - move this job at the end
        // because state update come first always and then components might be destroyed
        // so we are waiting to know if we need to create slot components or parent component is destroyed
        // and we should not create new slots
        { queue: true }
      )
    );
  }

  public destroy() {
    this.subs.forEach((unsub) => unsub());
    super.destroy();
  }

  public getName() {
    return this.name;
  }
}

export function generateSlots(name: string, vido: Vido, props: unknown) {
  return new Slots(name, vido, props);
}
