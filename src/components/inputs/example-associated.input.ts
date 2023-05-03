import { LitElement, css, html } from "lit";
import { customElement, eventOptions, property } from "lit/decorators.js";

@customElement("example-associated-input")
export class ExampleAssociatedInput extends LitElement {
  static styles = css`
    :host {
      display: block;
      contain: content;
    }
  `;

  @property({ type: String, reflect: true })
  name?: string;

  /**
   * WE NEED THIS!
   */
  static readonly formAssociated = true;
  #internals = this.attachInternals();

  /**
   * AND THIS!
   */
  @eventOptions({ passive: true })
  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.#internals.setFormValue(input.value);
  }

  render() {
    return html`
      <input
        type="text"
        placeholder="example-input-associated"
        @input="${this.handleInput}"
      />
    `;
  }
}