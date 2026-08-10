"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useRef, useState, type FormEvent } from "react";

import { CartLineItemView, CartPrice } from "@/components/cart/cart-line-item";
import { useCart } from "@/components/cart/cart-context";
import { CheckoutSelectField, CheckoutTextField } from "@/components/checkout/checkout-field";
import { pakistaniProvinces, paymentMethods } from "@/data/checkout-config";
import { submitCheckout } from "@/lib/checkout/submit-checkout";
import { shipping } from "@/lib/commerce/business-config";
import type { CheckoutPayload, CheckoutSubmissionResult, PaymentMethodId } from "@/types/checkout";
import {
  normalizePakistaniMobile,
  validateCheckoutForm,
  type CheckoutFieldErrors,
  type CheckoutFormValues,
} from "@/utils/checkout-validation";

const initialValues: CheckoutFormValues = {
  fullName: "",
  mobile: "",
  email: "",
  addressLine: "",
  apartment: "",
  city: "",
  province: "",
  postalCode: "",
  // Cash on Delivery is the only live payment method, so it is selected
  // by default instead of asking the customer to confirm the only choice.
  paymentMethod: "cod",
};

type FieldRefMap = Partial<Record<keyof CheckoutFormValues, HTMLInputElement | HTMLSelectElement | null>>;

export function CheckoutPageContent() {
  const router = useRouter();
  const { items, subtotalMinor, clearCart } = useCart();
  const [values, setValues] = useState<CheckoutFormValues>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutFormValues, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<Extract<CheckoutSubmissionResult, { status: "error" }> | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const fieldRefs = useRef<FieldRefMap>({});

  const liveErrors = useMemo(() => validateCheckoutForm(values), [values]);
  const visibleErrors: CheckoutFieldErrors = {};
  (Object.keys(liveErrors) as (keyof CheckoutFormValues)[]).forEach((key) => {
    if (submitAttempted || touched[key]) visibleErrors[key] = liveErrors[key];
  });

  function handleChange(name: keyof CheckoutFormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleBlur(name: keyof CheckoutFormValues) {
    setTouched((current) => ({ ...current, [name]: true }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);
    setSubmissionError(null);

    const validationErrors = validateCheckoutForm(values);
    const normalizedMobile = normalizePakistaniMobile(values.mobile);

    if (Object.keys(validationErrors).length > 0 || items.length === 0 || !normalizedMobile) {
      const firstErrorField = (Object.keys(validationErrors) as (keyof CheckoutFormValues)[])[0];
      fieldRefs.current[firstErrorField]?.focus();
      return;
    }

    const payload: CheckoutPayload = {
      idempotencyKey,
      contact: {
        fullName: values.fullName.trim(),
        mobile: normalizedMobile,
        email: values.email.trim().length > 0 ? values.email.trim() : null,
      },
      address: {
        addressLine: values.addressLine.trim(),
        apartment: values.apartment.trim().length > 0 ? values.apartment.trim() : null,
        city: values.city.trim(),
        province: values.province.length > 0 ? values.province : null,
        postalCode: values.postalCode.trim().length > 0 ? values.postalCode.trim() : null,
      },
      paymentMethod: values.paymentMethod as PaymentMethodId,
      items: items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productSlug: item.productSlug,
        title: item.title,
        variantLabel: item.variantLabel,
        quantity: item.quantity,
        unitPriceMinor: item.unitPriceMinor,
        currency: item.currency,
      })),
      subtotalMinor,
      currency: "PKR",
      submittedAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    try {
      const result = await submitCheckout(payload);

      if (result.status === "success") {
        clearCart();
        router.push(`/order-confirmation?order=${encodeURIComponent(result.orderNumber)}&token=${encodeURIComponent(result.confirmationToken)}`);
        return;
      }

      setSubmissionError(result);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="checkout-page checkout-page--empty">
        <p className="checkout-page__eyebrow">Your order</p>
        <h1>Your cart is empty.</h1>
        <Link className="checkout-page__continue" href="/shop">
          Continue shopping <span aria-hidden="true">&rarr;</span>
        </Link>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <header className="checkout-page__header">
        <p className="checkout-page__eyebrow">Secure checkout</p>
        <h1>Complete your order</h1>
        <p className="checkout-page__intro">Enter your delivery details and place your order with Cash on Delivery.</p>
      </header>

      <form className="checkout-page__layout" noValidate onSubmit={handleSubmit}>
        <div className="checkout-form">
          <section aria-labelledby="checkout-contact-heading" className="checkout-section">
            <h2 id="checkout-contact-heading">
              <span aria-hidden="true" className="checkout-section__number">01</span>
              Contact
            </h2>
            <div className="checkout-field-grid">
              <CheckoutTextField
                autoComplete="name"
                error={visibleErrors.fullName}
                label="Full Name"
                name="fullName"
                onBlur={() => handleBlur("fullName")}
                onChange={(event) => handleChange("fullName", event.target.value)}
                ref={(node) => {
                  fieldRefs.current.fullName = node;
                }}
                required
                value={values.fullName}
              />
              <CheckoutTextField
                autoComplete="tel"
                error={visibleErrors.mobile}
                hint="e.g. 0300 1234567"
                inputMode="tel"
                label="Mobile Number"
                name="mobile"
                onBlur={() => handleBlur("mobile")}
                onChange={(event) => handleChange("mobile", event.target.value)}
                ref={(node) => {
                  fieldRefs.current.mobile = node;
                }}
                required
                value={values.mobile}
              />
              <CheckoutTextField
                autoComplete="email"
                error={visibleErrors.email}
                inputMode="email"
                label="Email"
                name="email"
                onBlur={() => handleBlur("email")}
                onChange={(event) => handleChange("email", event.target.value)}
                ref={(node) => {
                  fieldRefs.current.email = node;
                }}
                type="email"
                value={values.email}
              />
            </div>
          </section>

          <section aria-labelledby="checkout-address-heading" className="checkout-section">
            <h2 id="checkout-address-heading">
              <span aria-hidden="true" className="checkout-section__number">02</span>
              Delivery Address
            </h2>
            <div className="checkout-field-grid">
              <CheckoutTextField
                autoComplete="address-line1"
                error={visibleErrors.addressLine}
                label="Address"
                name="addressLine"
                onBlur={() => handleBlur("addressLine")}
                onChange={(event) => handleChange("addressLine", event.target.value)}
                ref={(node) => {
                  fieldRefs.current.addressLine = node;
                }}
                required
                value={values.addressLine}
              />
              <CheckoutTextField
                autoComplete="address-line2"
                label="Apartment / Suite / Landmark"
                name="apartment"
                onChange={(event) => handleChange("apartment", event.target.value)}
                value={values.apartment}
              />
              <CheckoutTextField
                autoComplete="address-level2"
                error={visibleErrors.city}
                label="City"
                name="city"
                onBlur={() => handleBlur("city")}
                onChange={(event) => handleChange("city", event.target.value)}
                ref={(node) => {
                  fieldRefs.current.city = node;
                }}
                required
                value={values.city}
              />
              <CheckoutSelectField
                autoComplete="address-level1"
                label="Province / Region"
                name="province"
                onChange={(event) => handleChange("province", event.target.value)}
                value={values.province}
              >
                <option value="">Select province</option>
                {pakistaniProvinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </CheckoutSelectField>
              <CheckoutTextField
                autoComplete="postal-code"
                inputMode="numeric"
                label="Postal Code"
                name="postalCode"
                onChange={(event) => handleChange("postalCode", event.target.value)}
                value={values.postalCode}
              />
            </div>
          </section>

          <section aria-labelledby="checkout-delivery-heading" className="checkout-section">
            <h2 id="checkout-delivery-heading">
              <span aria-hidden="true" className="checkout-section__number">03</span>
              Delivery Method
            </h2>
            <div className="checkout-delivery">
              <div className="checkout-delivery__row">
                <span>Nationwide shipping</span>
                <strong>
                  <CartPrice amountMinor={shipping.flatRateMinor} />
                </strong>
              </div>
              <p className="checkout-delivery__couriers">Fulfilled via TCS or Leopards</p>
            </div>
          </section>

          <section aria-labelledby="checkout-payment-heading" className="checkout-section">
            <h2 id="checkout-payment-heading">
              <span aria-hidden="true" className="checkout-section__number">04</span>
              Payment
            </h2>
            <div
              aria-describedby={visibleErrors.paymentMethod ? "paymentMethod-error" : undefined}
              aria-labelledby="checkout-payment-heading"
              className="checkout-payment-methods"
              role="radiogroup"
            >
              {paymentMethods.map((method, index) => (
                <label className="checkout-payment-option" data-disabled={!method.enabled || undefined} key={method.id}>
                  <input
                    checked={values.paymentMethod === method.id}
                    disabled={!method.enabled}
                    name="paymentMethod"
                    onChange={() => handleChange("paymentMethod", method.id)}
                    ref={
                      index === 0
                        ? (node) => {
                            fieldRefs.current.paymentMethod = node;
                          }
                        : undefined
                    }
                    type="radio"
                    value={method.id}
                  />
                  <span>
                    <strong>{method.label}</strong>
                    <span>{method.enabled ? method.description : "Coming soon"}</span>
                  </span>
                </label>
              ))}
            </div>
            {visibleErrors.paymentMethod && (
              <p className="checkout-field__error" id="paymentMethod-error" role="alert">
                {visibleErrors.paymentMethod}
              </p>
            )}
          </section>
        </div>

        <aside aria-label="Order summary" className="checkout-summary">
          <div className="checkout-summary__header">
            <h2>Order Summary</h2>
            <Link href="/cart">Edit cart</Link>
          </div>
          <div className="checkout-summary__items">
            {items.map((item) => (
              <CartLineItemView item={item} key={item.id} readOnly />
            ))}
          </div>
          <div className="checkout-summary__row">
            <span>Subtotal</span>
            <strong>
              <CartPrice amountMinor={subtotalMinor} />
            </strong>
          </div>
          <div className="checkout-summary__row">
            <span>Shipping</span>
            <strong>
              <CartPrice amountMinor={shipping.flatRateMinor} />
            </strong>
          </div>
          <div className="checkout-summary__row checkout-summary__total">
            <span>Total</span>
            <strong>
              <CartPrice amountMinor={subtotalMinor + shipping.flatRateMinor} />
            </strong>
          </div>

          {submissionError && (
            <div className="checkout-notice" role="alert">
              <p>{submissionError.message}</p>
              {submissionError.itemIssues && submissionError.itemIssues.length > 0 && (
                <ul>
                  {submissionError.itemIssues.map((issue, index) => (
                    <li className="checkout-field__error" key={`${issue.productSlug}-${issue.variantLabel ?? "default"}-${index}`}>
                      {issue.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <button className="checkout-place-order" disabled={isSubmitting} type="submit">
            {isSubmitting ? (
              "Placing order…"
            ) : (
              <>
                <span className="checkout-place-order__label">
                  <span>Place Order</span>
                  <span className="checkout-place-order__method">Cash on Delivery</span>
                </span>
                <span aria-hidden="true" className="checkout-place-order__arrow">
                  &rarr;
                </span>
              </>
            )}
          </button>
          <ul className="checkout-summary__notes">
            <li>Cash on Delivery</li>
            <li>Flat shipping — Rs 199</li>
            <li>TCS / Leopards</li>
            <li>7-day return &amp; exchange</li>
          </ul>
        </aside>
      </form>
    </section>
  );
}
