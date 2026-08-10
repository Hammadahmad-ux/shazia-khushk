export interface CheckoutFormValues {
  fullName: string;
  mobile: string;
  email: string;
  addressLine: string;
  apartment: string;
  city: string;
  province: string;
  postalCode: string;
  paymentMethod: string;
}

export type CheckoutFieldErrors = Partial<Record<keyof CheckoutFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizePakistaniMobile(raw: string): string | null {
  let digits = raw.trim().replace(/[\s\-()]/g, "");

  if (digits.startsWith("+92")) digits = digits.slice(3);
  else if (digits.startsWith("0092")) digits = digits.slice(4);
  else if (digits.startsWith("92") && digits.length === 12) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);

  if (!/^3\d{9}$/.test(digits)) return null;
  return `+92${digits}`;
}

export function validateCheckoutForm(values: CheckoutFormValues): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = "Enter your full name.";
  }

  if (!normalizePakistaniMobile(values.mobile)) {
    errors.mobile = "Enter a valid Pakistani mobile number, e.g. 0300 1234567.";
  }

  if (values.email.trim().length > 0 && !EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (values.addressLine.trim().length < 5) {
    errors.addressLine = "Enter your street address.";
  }

  if (values.city.trim().length < 2) {
    errors.city = "Enter your city.";
  }

  if (!values.paymentMethod) {
    errors.paymentMethod = "Select a payment method.";
  }

  return errors;
}
