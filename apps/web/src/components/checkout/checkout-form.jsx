"use client";

import { Clock3, LockKeyhole, MapPin, Store, Truck } from "lucide-react";
import { useCurrency } from "@/components/providers/currency-provider";
import shared from "@/styles/shared.module.css";
import styles from "./checkout-form.module.css";

export function CheckoutForm({
  onSubmit,
  pending,
  error,
  total,
  deliveryMethod,
  onDeliveryMethodChange,
}) {
  const { formatPrice } = useCurrency();
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <fieldset>
        <legend>Contact</legend>
        <div className={styles.fields}>
          <label className={styles.fullField}>
            <span>Email address</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              maxLength={254}
              required
            />
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Delivery</legend>
        <div className={styles.deliveryOptions}>
          <label
            className={styles.deliveryOption}
            data-selected={deliveryMethod === "ship"}
          >
            <input
              type="radio"
              name="deliveryMethod"
              value="ship"
              checked={deliveryMethod === "ship"}
              onChange={() => onDeliveryMethodChange("ship")}
            />
            <Truck size={20} aria-hidden="true" />
            <span>
              <strong>Ship</strong>
              <small>To your address</small>
            </span>
          </label>
          <label
            className={styles.deliveryOption}
            data-selected={deliveryMethod === "pickup"}
          >
            <input
              type="radio"
              name="deliveryMethod"
              value="pickup"
              checked={deliveryMethod === "pickup"}
              onChange={() => onDeliveryMethodChange("pickup")}
            />
            <Store size={20} aria-hidden="true" />
            <span>
              <strong>Pickup</strong>
              <small>Free collection</small>
            </span>
          </label>
        </div>
        {deliveryMethod === "pickup" && (
          <div className={styles.pickupDetails} aria-label="Pickup details">
            <div>
              <MapPin size={19} aria-hidden="true" />
              <span>
                <strong>Pickup area: Beirut, Lebanon</strong>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Beirut%2C%20Lebanon"
                  target="_blank"
                  rel="noreferrer"
                >
                  View Beirut on Google Maps
                </a>
              </span>
            </div>
            <div>
              <Clock3 size={19} aria-hidden="true" />
              <span>Allow 5 hours for your order to be ready for pickup.</span>
            </div>
          </div>
        )}
      </fieldset>
      <fieldset>
        <legend>Payment</legend>
        <p className={styles.paymentIntro}>
          Your order is placed securely. Pay when you receive it.
        </p>
        <label className={styles.paymentOption}>
          <input
            type="radio"
            name="payment"
            value="pay_on_delivery"
            defaultChecked
          />
          <span>
            <strong>
              {deliveryMethod === "pickup"
                ? "Pay on pickup"
                : "Pay on delivery"}
            </strong>
            <small>Payment is collected when you receive your order.</small>
          </span>
          <span className={styles.paymentPrice}>No extra fee</span>
        </label>
      </fieldset>
      <fieldset>
        <legend>Billing address</legend>
        <p className={styles.billingIntro}>
          {deliveryMethod === "ship"
            ? "This address will also be used for delivery."
            : "No street address is needed for pickup. Tell us who will collect your order."}
        </p>
        {deliveryMethod === "ship" && (
          <div className={styles.fields}>
            <label className={styles.fullField}>
              <span>Country / region</span>
              <input name="country" value="Lebanon" readOnly />
            </label>
            <label>
              <span>First name (optional)</span>
              <input
                name="firstName"
                autoComplete="given-name"
                placeholder="First name"
                maxLength={100}
              />
            </label>
            <label>
              <span>Last name</span>
              <input
                name="lastName"
                autoComplete="family-name"
                placeholder="Last name"
                minLength={2}
                maxLength={100}
                required
              />
            </label>
            <label className={styles.fullField}>
              <span>Address</span>
              <input
                name="address"
                autoComplete="street-address"
                placeholder="Street and building"
                minLength={3}
                maxLength={200}
                required
              />
            </label>
            <label className={styles.fullField}>
              <span>Apartment, suite, etc. (optional)</span>
              <input
                name="apartment"
                autoComplete="address-line2"
                placeholder="Apartment, suite, floor, etc."
                maxLength={200}
              />
            </label>
            <label>
              <span>City</span>
              <input
                name="city"
                autoComplete="address-level2"
                placeholder="City"
                maxLength={100}
                required
              />
            </label>
            <label>
              <span>Postal code (optional)</span>
              <input
                name="postalCode"
                autoComplete="postal-code"
                placeholder="Postal code"
                maxLength={30}
              />
            </label>
          </div>
        )}
        {deliveryMethod === "pickup" && (
          <div className={styles.fields}>
            <label>
              <span>First name (optional)</span>
              <input
                name="firstName"
                autoComplete="given-name"
                placeholder="First name"
                maxLength={100}
              />
            </label>
            <label>
              <span>Last name</span>
              <input
                name="lastName"
                autoComplete="family-name"
                placeholder="Last name"
                minLength={2}
                maxLength={100}
                required
              />
            </label>
          </div>
        )}
        <div className={styles.phoneField}>
          <label htmlFor="checkout-phone">Phone number (optional)</label>
          <div className={styles.phoneInput}>
            <span aria-label="Lebanon country code">🇱🇧 +961</span>
            <input
              id="checkout-phone"
              name="phoneNational"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              pattern="0?[0-9]{7,8}"
              placeholder="71441351"
              title="Enter 7 or 8 digits, optionally starting with 0"
              maxLength={9}
            />
          </div>
        </div>
      </fieldset>
      {error && (
        <p className={shared.error} role="alert">
          {error}
        </p>
      )}
      <button
        className={`${shared.button} ${shared.buttonBlue} ${styles.submit}`}
        type="submit"
        disabled={pending}
      >
        <LockKeyhole size={17} aria-hidden="true" />
        {pending ? "Placing order…" : `Place order · ${formatPrice(total)}`}
      </button>
    </form>
  );
}
