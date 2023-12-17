const hexToRGBA = (hex: string, alpha = 1) => {
  // Ensure the hex value starts with #
  hex = hex.startsWith("#") ? hex : `#${hex}`;

  // Parse the hex values
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Validate the alpha value
  const validatedAlpha = Math.min(1, Math.max(0, alpha));

  // Return the RGBA string
  return `rgba(${r}, ${g}, ${b}, ${validatedAlpha})`;
};

export default hexToRGBA;
