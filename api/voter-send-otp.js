export default async function handler(req, res) {
  const { mo, pass } = req.query;

  if (!mo || !pass) {
    return res.status(400).json({ message: 'Mobile number and password are required' });
  }

  const url1 = 'https://gateway.eci.gov.in/api/v1/authn-voter/password-flow';
  const url2 = 'https://gateway.eci.gov.in/api/v1/authn-voter/otp-flow-send';

  const data1 = JSON.stringify({
    applicationName: 'VHA',
    otp: '',
    password: pass,
    roleCode: '*',
    username: mo,
  });

  const data2 = JSON.stringify({
    applicationName: 'VHA',
    otp: '',
    password: '',
    roleCode: '*',
    username: mo,
  });

  try {
    const response1 = await fetch(url1, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'okhttp/3.14.7',
      },
      body: data1,
    });

    if (!response1.ok) {
      const errorText = await response1.text();
      console.error('Error in password flow:', errorText);
      return res.status(response1.status).json({ message: 'Error in password flow', details: errorText });
    }

    const json1 = await response1.json();

    const response2 = await fetch(url2, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'okhttp/3.14.7',
      },
      body: data2,
    });

    if (!response2.ok) {
      const errorText = await response2.text();
      console.error('Error in OTP flow:', errorText);
      return res.status(response2.status).json({ message: 'Error in OTP flow', details: errorText });
    }

    const json2 = await response2.json();

    res.status(200).json({
      passwordFlowResponse: json1,
      otpFlowResponse: json2,
    });
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ message: 'Internal server error', error: error.toString() });
  }
}
