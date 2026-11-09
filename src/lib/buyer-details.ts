export type BuyerDetails = {
  fullName: string;
  email: string;
  phone: string;
  age: number;
  street: string;
  city: string;
  state: string;
  postal: string;
  country: string;
};

export type BuyerDetailsResult =
  | { ok: true; details: BuyerDetails }
  | { ok: false; error: string; field?: keyof BuyerDetails | "age" };

const US_STATES =
  /^(A[LKZR]|C[AOT]|D[EC]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEHINOST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$/i;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function read(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function parseBuyerDetails(formData: FormData): BuyerDetailsResult {
  const fullName = read(formData, "fullName");
  const email = read(formData, "email").toLowerCase();
  const phone = read(formData, "phone");
  const street = read(formData, "street");
  const city = read(formData, "city");
  const state = read(formData, "state").toUpperCase();
  const postal = read(formData, "postal");
  const country = (read(formData, "country") || "US").toUpperCase();
  const ageRaw = read(formData, "age");

  if (fullName.length < 2 || fullName.length > 80) {
    return { ok: false, error: "Enter your full legal name.", field: "fullName" };
  }
  if (!/^[A-Za-z][A-Za-z .'-]*[A-Za-z.]$/.test(fullName) && fullName.split(/\s+/).length < 2) {
    return {
      ok: false,
      error: "Enter first and last name.",
      field: "fullName",
    };
  }
  if (fullName.split(/\s+/).filter(Boolean).length < 2) {
    return { ok: false, error: "Enter first and last name.", field: "fullName" };
  }

  if (!email || email.length > 120 || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Enter a valid email address.", field: "email" };
  }

  const phoneDigits = phone.replace(/[^\d]/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return {
      ok: false,
      error: "Enter a valid phone number with area code.",
      field: "phone",
    };
  }

  const age = Number(ageRaw);
  if (!Number.isFinite(age) || !Number.isInteger(age) || age < 1 || age > 120) {
    return { ok: false, error: "Enter your age as a whole number.", field: "age" };
  }
  if (age < 18) {
    return {
      ok: false,
      error: "You must be 18 or older to place an order.",
      field: "age",
    };
  }

  if (street.length < 5 || street.length > 120) {
    return { ok: false, error: "Enter a complete street address.", field: "street" };
  }
  if (city.length < 2 || city.length > 80) {
    return { ok: false, error: "Enter your city.", field: "city" };
  }
  if (!US_STATES.test(state) && country === "US") {
    return { ok: false, error: "Enter a valid 2-letter US state code.", field: "state" };
  }
  if (state.length < 2 || state.length > 40) {
    return { ok: false, error: "Enter your state or province.", field: "state" };
  }
  if (!/^\d{5}(-\d{4})?$/.test(postal) && country === "US") {
    return { ok: false, error: "Enter a valid ZIP code.", field: "postal" };
  }
  if (postal.length < 3 || postal.length > 16) {
    return { ok: false, error: "Enter a valid postal code.", field: "postal" };
  }

  return {
    ok: true,
    details: {
      fullName,
      email,
      phone: phoneDigits.length === 10 ? `+1${phoneDigits}` : `+${phoneDigits}`,
      age,
      street,
      city,
      state,
      postal,
      country,
    },
  };
}

export function formatBuyerAddress(details: BuyerDetails) {
  return `${details.street}, ${details.city}, ${details.state} ${details.postal}, ${details.country}`;
}

export function buyerDetailsEmailBlock(details: BuyerDetails) {
  return [
    `Name: ${details.fullName}`,
    `Email: ${details.email}`,
    `Phone: ${details.phone}`,
    `Age: ${details.age}`,
    `Address: ${formatBuyerAddress(details)}`,
  ].join("\n");
}
