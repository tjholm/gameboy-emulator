import { GameboyButton } from "@/input/gameboy-button.enum";
import { controllerDataRegister } from "@/memory/shared-memory-registers";
import { setBit } from "@/helpers/binary-helpers";
import { memory } from "@/memory/memory";

export class Input {
  isPressingUp = false;
  isPressingDown = false;
  isPressingLeft = false;
  isPressingRight = false;

  isPressingSelect = false;
  isPressingStart = false;

  isPressingA = false;
  isPressingB = false;

  isPollingDirections = false;
  isPollingButtons = false;

  buttonPressed(button: GameboyButton) {
    this.setState(button, true);
  }

  buttonReleased(button: GameboyButton) {
    this.setState(button, false);
  }

  setInputToCheck(byte: number) {
    this.isPollingButtons = ((byte >> 4) & 0b1) === 1;
    this.isPollingDirections = ((byte >> 5) & 0b1) === 1;
  }

  reportInput(): number {
    let inputValue = 0b1111;

    if (this.isPollingDirections) {
      inputValue = setBit(inputValue, 0, this.isPressingRight ? 0 : 1);
      inputValue = setBit(inputValue, 1, this.isPressingLeft ? 0 : 1);
      inputValue = setBit(inputValue, 2, this.isPressingUp ? 0 : 1);
      inputValue = setBit(inputValue, 3, this.isPressingDown ? 0 : 1);
    }

    if (this.isPollingButtons) {
      inputValue = setBit(inputValue, 0, this.isPressingA ? 0 : 1);
      inputValue = setBit(inputValue, 1, this.isPressingB ? 0 : 1);
      inputValue = setBit(inputValue, 2, this.isPressingSelect ? 0 : 1);
      inputValue = setBit(inputValue, 3, this.isPressingStart ? 0 : 1);
    }

    inputValue = setBit(inputValue, 4, this.isPollingButtons ? 0 : 1);
    inputValue = setBit(inputValue, 5, this.isPollingDirections ? 0 : 1);

    return inputValue;
  }

  private setState(button: GameboyButton, isPressed: boolean) {
    switch (button) {
      case GameboyButton.Up:
        this.isPressingUp = isPressed;
        break;
      case GameboyButton.Down:
        this.isPressingDown = isPressed;
        break;
      case GameboyButton.Left:
        this.isPressingLeft = isPressed;
        break;
      case GameboyButton.Right:
        this.isPressingRight = isPressed;
        break;

      case GameboyButton.Select:
        this.isPressingSelect = isPressed;
        break;
      case GameboyButton.Start:
        this.isPressingStart = isPressed;
        break;

      case GameboyButton.A:
        this.isPressingA = isPressed;
        break;
      case GameboyButton.B:
        this.isPressingB = isPressed;
        break;
    }
  }
}

export const input = new Input();