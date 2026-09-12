const http = require('http');

function postJson(url, data, token = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      port: u.port || 80,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

async function test() {
  try {
    console.log('Logging in as admin...');
    const loginRes = await postJson('http://localhost:5000/api/auth/login', {
      email: 'admin',
      password: 'Thanh2001@'
    });

    if (loginRes.status !== 200) {
      console.error('Login failed:', loginRes);
      return;
    }

    const token = loginRes.data.token;
    console.log('Login successful! Token acquired.');

    console.log('Attempting to create a new course with order: null (simulating NaN)...');
    const payload = {
      nameVi: 'Tài liệu test null ' + Date.now(),
      nameEn: 'Test Document null ' + Date.now(),
      categoryVi: 'Test',
      categoryEn: 'Test',
      descriptionVi: 'Mô tả test',
      descriptionEn: 'Test description',
      driveUrl: 'https://drive.google.com/test',
      zipPassword: '123',
      isActive: true,
      order: null, // this simulates NaN or empty string conversion if evaluated to null
      specifications: [
        { labelVi: 'Dung lượng', labelEn: 'Size', value: '10MB' }
      ],
      images: [],
      catalogUrl: ''
    };

    const createRes = await postJson('http://localhost:5000/api/courses', payload, token);
    console.log('Create Response Status:', createRes.status);
    console.log('Create Response Data:', JSON.stringify(createRes.data || createRes.raw, null, 2));

  } catch (err) {
    console.error('Test run failed:', err);
  }
}

test();
