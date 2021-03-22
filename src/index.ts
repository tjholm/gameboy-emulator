import { operations } from "@/cpu/instruction-set/operations";
import { cpu } from "@/cpu/cpu";
import { cartridge, CartridgeEntryPointOffset } from "@/game-rom/cartridge";
import { CyclesPerFrame, gpu } from "@/gpu/gpu";
import { registers } from "@/cpu/registers/registers";

let context: CanvasRenderingContext2D;
let vramCanvas: HTMLCanvasElement;
let vramContext: CanvasRenderingContext2D;

window.addEventListener('load', () => {
  const fileInput = document.querySelector('.file-input') as HTMLInputElement;
  fileInput?.addEventListener('change', onFileChange);

  const canvas = document.querySelector('canvas') as HTMLCanvasElement;
  context = canvas.getContext('2d') as CanvasRenderingContext2D;

  vramCanvas = document.querySelector('#vram') as HTMLCanvasElement;
  vramContext = vramCanvas.getContext('2d') as CanvasRenderingContext2D;
  console.log(operations.length);
});


async function onFileChange(event: Event) {
  const fileElement = event.target as HTMLInputElement;

  if (fileElement.files && fileElement.files[0]) {
    const arrayBuffer = await fileToArrayBuffer(fileElement.files[0]);
    cartridge.loadCartridge(arrayBuffer);

    console.log('title: ' + cartridge.title);
    console.log('version: ' + cartridge.versionNumber);
    console.log('type: ' + cartridge.type);
    console.log('rom size: ' + cartridge.romSize);
    console.log('ram size: ' + cartridge.ramSize);

    context.putImageData(cartridge.nintendoLogo, 0, 0);

    let cycles = 0;
    registers.programCounter = CartridgeEntryPointOffset;
    while (cycles < CyclesPerFrame) {
      cycles += cpu.tick();
      gpu.tick(cycles);
    }

    console.log(cycles);

    vramContext.imageSmoothingEnabled = false;
    vramContext.putImageData(gpu.characterImageData, 0, 0);
    vramContext.drawImage( vramCanvas, 0, 0, 8*vramCanvas.width, 8*vramCanvas.height );

  }
}

function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);

    fileReader.onerror = () => {
      fileReader.abort();
      reject(new DOMException('Error parsing file'))
    }

    fileReader.readAsArrayBuffer(file);
  });
}
