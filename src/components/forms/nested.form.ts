import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('nested-form')
export class NestedForm extends LitElement {
  static styles = css`
    :host {
      display: block;
      contain: content;
    }
  `

  static readonly formAssociated = true;
  
  render() {
    return html`
      <form>
      <input type="text" name="nested-text-1" />
      <input type="text" name="nested-text-2" />
      </form>
    `
  }
}