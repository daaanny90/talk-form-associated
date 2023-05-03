import { LitElement, html, css } from "lit";
import { customElement, query, eventOptions, state } from "lit/decorators.js";

import type { FormProxy } from "../utils/proxy.form";

import "../components/inputs/example.input";
import "../components/inputs/example-associated.input";
import "../components/forms/nested.form";

import "../utils/proxy.form";

@customElement("normal-form")
export class NormalForm extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  @state()
  valid = false;

  @query("form")
  form!: HTMLFormElement;

  @query("foo-form-proxy")
  formProxy!: FormProxy;

  @query("pre")
  outputView!: HTMLPreElement;

  getFormDataRaw(...forms: HTMLFormElement[]): Record<string, string | null> {
    return forms
      .map((form) => new FormData(form))
      .flatMap((data) => Array.from(data.entries()))
      .reduce((a, [k, v]) => ({ ...a, [k]: v }), {});
  }

  private _handleSubmit(event: Event) {
    event.preventDefault();
    const raw = this.getFormDataRaw(this.form, this.formProxy.form);
    // const raw = this.getFormDataRaw(this.form);
    this.outputView.textContent = JSON.stringify(raw, undefined, 2);
  }

  checkValidity(): boolean {
    this.valid =
      this.form.checkValidity() && this.formProxy.form.checkValidity();
    return this.valid;
  }

  @eventOptions({ passive: false })
  handleSlotChange() {
    this.checkValidity();
  }

  render() {
    return html`
      <form @submit=${this._handleSubmit}>
        <foo-form-proxy>
          <slot @slotchange="${this.handleSlotChange}"></slot>
        </foo-form-proxy>
        <!-- <slot></slot> -->
        <button type="submit">Submit</button>
      </form>
      <pre></pre>
    `;
  }
}
