import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("example-input")
export class ExampleInput extends LitElement {
  static styles = css`
    :host {
      display: block;
      contain: content;
    }
  `;

  @property({ type: String, reflect: true })
  name?: string;

  render() {
    return html`
      <input
        type="text"
        placeholder="example-custom-input"
      />
    `;
  }
}