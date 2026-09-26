import { describe, expect, it } from "vitest";
import { prepareCheckoutDelivery } from "./checkout-input";

describe("prepareCheckoutDelivery", () => {
  it("requires a meaningful last name even when a first name is present", () => {
    expect(() =>
      prepareCheckoutDelivery([
        ["firstName", "Jane"],
        ["lastName", "  "],
      ]),
    ).toThrow("Enter a last name");
  });

  it("limits the combined name and normalizes a Lebanese phone number", () => {
    expect(() =>
      prepareCheckoutDelivery([
        ["firstName", "A".repeat(60)],
        ["lastName", "B".repeat(60)],
      ]),
    ).toThrow("100 characters");

    expect(
      prepareCheckoutDelivery([
        ["firstName", "  Jane "],
        ["lastName", " Doe  "],
        ["phoneNational", "071441351"],
      ]),
    ).toMatchObject({ name: "Jane Doe", phone: "+96171441351" });
  });

  it("rejects non-digits rather than silently changing a phone number", () => {
    expect(() =>
      prepareCheckoutDelivery([
        ["lastName", "Customer"],
        ["phoneNational", "71<script>"],
      ]),
    ).toThrow("valid Lebanese phone number");
  });
});
