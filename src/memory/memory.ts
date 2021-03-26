import { cartridge } from "../cartridge/cartridge";

const memoryBuffer = new ArrayBuffer(0x10000);
const memoryView = new DataView(memoryBuffer);
const memoryBytes = new Uint8Array(memoryBuffer);

export const memory = {
  get memoryBytes() {
    return memoryBytes;
  },

  reset() {
    memoryBytes.fill(0, 0, memoryBytes.length - 1);
  },

  readByte(address: number) {
    if (isAccessingCartridge(address)) {
      return cartridge.readByte(address);
    } else {
      return memoryView.getUint8(address);
    }
  },

  readSignedByte(address: number) {
    if (isAccessingCartridge(address)) {
      return cartridge.readSignedByte(address);
    } else {
      return memoryView.getInt8(address);
    }
  },

  readWord(address: number) {
    if (isAccessingCartridge(address)) {
      return cartridge.readWord(address);
    } else {
      return memoryView.getUint16(address, true);
    }
  },

  writeByte(address: number, value: number) {
    if (isAccessingCartridge(address)) {
      return cartridge.writeByte(address, value);
    } else {
      memoryView.setUint8(address, value);
    }
  },

  writeWord(address: number, value: number) {
    if (isAccessingCartridge(address)) {
      return cartridge.writeWord(address, value);
    } else {
      memoryView.setUint16(address, value, true);
    }
  }
}

function isAccessingCartridge(address: number): boolean {
  // TODO: Revisit how to handle cartridge ram
  return address <= 0x7FFF; // || (address >= 0xA000 && address <= 0xBFFF);
}