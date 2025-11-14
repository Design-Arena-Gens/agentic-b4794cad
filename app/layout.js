export const metadata = {
  title: 'Santa\'s North Pole Adventure',
  description: 'A magical last-minute trip to Santa\'s quarters at the North Pole!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>{children}</body>
    </html>
  )
}
