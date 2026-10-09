// UPI Deep Link Generator for MealMate

export const generateUPILink = ({
  upiId,
  name,
  amount,
  note = "MealMate Order",
}) => {
  // Standard UPI deep link format
  // upi://pay?pa=<upi_id>&pn=<payee_name>&am=<amount>&cu=INR&tn=<note>

  const params = new URLSearchParams({
    pa: upiId,
    pn: name,
    am: amount.toString(),
    cu: "INR",
    tn: note,
  });

  return `upi://pay?${params.toString()}`;
};

// App-specific deep links (for better UX on mobile)
export const getGPayLink = (opts) => {
  const base = generateUPILink(opts);
  return base; // GPay opens with generic UPI link
};

export const getPhonePeLink = (opts) => {
  const base = generateUPILink(opts);
  return `phonepe://${base}`;
};

export const getPaytmLink = (opts) => {
  const base = generateUPILink(opts);
  return `paytmmp://${base}`;
};

// Validate UPI ID format
export const isValidUPIId = (upiId) => {
  // Format: username@bankname
  // Example: john@okhdfcbank, john.doe@ybl, john123@paytm

  if (!upiId || typeof upiId !== "string") return false;

  const upiRegex = /^[a-zA-Z0-9._-]{3,}@[a-zA-Z]{3,}$/;
  return upiRegex.test(upiId);
};

// Common UPI suffixes (for suggestions)
export const UPI_SUFFIXES = [
  "@okhdfcbank",
  "@okicici",
  "@oksbi",
  "@okaxis",
  "@ybl",
  "@paytm",
  "@upi",
  "@apl",
];
