import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../memory-register";

export class HighOrderFrequencyRegister implements SingleByteMemoryRegister {
  offset: number;
  name: string;

  constructor(offset: number, name:string) {
    this.offset = offset;
    this.name = name;
  }

  get value() {
    return memory.readByte(this.offset);
  }

  get highOrderFrequencyRegister() {
    return this.value;
  }

  get isInitialize() {
    return this.value >> 7 === 1;
  }

  get isContinuousSelection() {
    return ((this.value >> 6) & 0b1) === 1;
  }

  get highOrderFrequencyData() {
    return this.value & 0b111;
  }
}
