// pages/api/auth-voter.js

export default async function handler(req, res) {
  // Check if the method is GET
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Get 'mo' and 'pass' from the query string
  const { mo, pass } = req.query;

  // First API request to 'password-flow'
  const url = 'https://gateway.eci.gov.in/api/v1/authn-voter/password-flow';
  const data = {
    applicationName: 'VHA',
    otp: '',
    password: pass,
    roleCode: '*',
    username: mo
  };

  try {
    // Make the first POST request
    const passwordResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'okhttp/3.14.7',
        'Host': 'gateway.eci.gov.in',
        'Connection': 'Keep-Alive',
      },
      body: JSON.stringify(data),
    });

    const passwordResult = await passwordResponse.json();

    // Second API request to 'otp-flow-send'
    const url1 = 'https://gateway.eci.gov.in/api/v1/authn-voter/otp-flow-send';
    const data1 = {
      applicationName: 'VHA',
      otp: '',
      password: '',
      roleCode: '*',
      username: mo
    };

    // Make the second POST request
    const otpResponse = await fetch(url1, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'okhttp/3.14.7',
        'Host': 'gateway.eci.gov.in',
        'Connection': 'Keep-Alive',
      },
      body: JSON.stringify(data1),
    });

    const otpResult = await otpResponse.json();

    res.status(200).json(otpResult);

  } catch {
    // Error handling
    res.status(500).json(otpResult);
  }
}
