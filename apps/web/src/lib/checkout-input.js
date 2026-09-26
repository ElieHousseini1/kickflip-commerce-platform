export function prepareCheckoutDelivery(entries) {
  const delivery = Object.fromEntries(entries);
  for (const [key, value] of Object.entries(delivery)) {
    if (typeof value === "string") delivery[key] = value.trim();
  }

  const firstName = delivery.firstName ?? "";
  const lastName = delivery.lastName ?? "";
  if (lastName.length < 2) {
    throw new Error("Enter a last name of at least 2 characters.");
  }

  delivery.name = [firstName, lastName].filter(Boolean).join(" ");
  if (delivery.name.length > 100) {
    throw new Error("Your full name must be 100 characters or fewer.");
  }

  if (delivery.phoneNational) {
    if (!/^0?[0-9]{7,8}$/.test(delivery.phoneNational)) {
      throw new Error("Enter a valid Lebanese phone number.");
    }
    delivery.phone = `+961${delivery.phoneNational.replace(/^0/, "")}`;
  }

  delete delivery.firstName;
  delete delivery.lastName;
  delete delivery.phoneNational;
  return delivery;
}
