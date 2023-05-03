import { css, html, LitElement } from "lit";
import {
  customElement,
  eventOptions,
  queryAssignedElements,
} from "lit/decorators.js";

type NativeFormElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;
type CustomFormElement = HTMLElement & { value: string | null | FormData };
type FormElement = NativeFormElement | CustomFormElement;

@customElement("foo-form-proxy")
export class FormProxy extends LitElement {
  static readonly styles = css`
    :host {
      display: contents;
    }
  `;

  readonly form = document.createElement("form");

  @queryAssignedElements({ flatten: true })
  elements!: HTMLElement[];

  @eventOptions({ passive: true })
  handleSlotChange() {
    // check if the proxy form element is already attached to the dom
    // to prevent infinite loops as the slot change will occur every time
    // we set add the form (again)
    if (this.form.isConnected) return;

    // get all form transitive elements
    const allElements = this.collectElementsWithAncestors(this.elements);
    const formElements = this.collectFormElements(allElements);

    // add the form and set its id to the form elements `form` attribute
    this.form.id = "proxy";
    formElements[0].parentElement?.appendChild(this.form);
    formElements.forEach((formElement) => {
      formElement.setAttribute("form", "proxy");
    });
  }

  collectElementsWithAncestors(from: HTMLElement[]): HTMLElement[] {
    return from.reduce((found, element) => {
      const children = element.getElementsByTagName(
        "*"
      ) as HTMLCollectionOf<HTMLElement>;
      return [...found, ...children];
    }, from);
  }

  collectFormElements(from: HTMLElement[]): FormElement[] {
    return from.filter(
      (element) =>
        this.isCustomFormElement(element) || this.isNativeFormElement(element)
    ) as FormElement[];
  }

  isCustomFormElement(element: HTMLElement): element is CustomFormElement {
    return (
      "formAssociated" in element.constructor &&
      (element.constructor as any).formAssociated === true
    );
  }

  isNativeFormElement(element: HTMLElement): element is NativeFormElement {
    return (
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement
    );
  }

  render() {
    return html` <slot @slotchange="${this.handleSlotChange}"></slot> `;
  }
}
