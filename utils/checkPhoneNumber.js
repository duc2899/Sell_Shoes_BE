exports.isValidVietnamPhoneNumber = (phoneNumber) => {
  // Regular expression for Vietnamese phone numbers
  const vietnamPhoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

  // Test the phone number against the regex
  return vietnamPhoneRegex.test(phoneNumber);
};
