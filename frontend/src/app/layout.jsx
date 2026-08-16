import Providers from '../components/providers/Providers';
import '../index.css';
import '../App.css';

export async function generateMetadata() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/company`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const appName = data.data?.nameVi || data.data?.nameEn || 'THANHTDH';
      return {
        title: `${appName} - Industrial Automation Solutions`,
        description: `${appName} - Giải pháp tự động hóa công nghiệp hàng đầu Việt Nam. Machine Vision, Robot Integration, PLC Programming, AGV/AMR, SCADA.`,
        keywords: `tự động hóa, automation, robot, PLC, SCADA, machine vision, AGV, ${appName}`,
        openGraph: {
          title: `${appName} - Industrial Automation Solutions`,
          description: 'Giải pháp tự động hóa công nghiệp hàng đầu Việt Nam',
          type: 'website',
        },
      };
    }
  } catch (err) {}
  
  const APP_NAME = 'THANHTDH';
  return {
    title: `${APP_NAME} - Industrial Automation Solutions`,
    description: `${APP_NAME} - Giải pháp tự động hóa công nghiệp hàng đầu Việt Nam.`,
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
