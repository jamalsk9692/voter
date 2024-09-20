export default async function handler(req, res) {
  const { mo, pass } = req.query;

  if (!mo || !pass) {
    return res.status(400).json({ message: 'Mobile number and password are required' });
  }

  const url1 = 'https://gateway.eci.gov.in/api/v1/authn-voter/password-flow';
  const url2 = 'https://gateway.eci.gov.in/api/v1/authn-voter/otp-flow-send';

  // Data for first request (password flow)
  const data1 = JSON.stringify({
    applicationName: 'VHA',
    otp: '',
    password: pass,
    roleCode: '*',
    username: mo,
  });

  // Data for second request (OTP flow)
  const data2 = JSON.stringify({
    applicationName: 'VHA',
    otp: '',
    password: '',
    roleCode: '*',
    username: mo,
  });

  try {
    // First API request (password flow)
    const response1 = await fetch(url1, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'okhttp/3.14.7',
      },
      body: data1,
    });

    const json1 = await response1.json();

    // Second API request (OTP flow)
    const response2 = await fetch(url2, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'okhttp/3.14.7',
      },
      body: data2,
    });

    const json2 = await response2.json();

    // Send both responses back to the client
    res.status(200).json({
      passwordFlowResponse: json1,
      otpFlowResponse: json2,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
