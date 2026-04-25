import './globals.css'

export const metadata = {
  title: 'FraudGuard AI | Advanced Credit Card Fraud Detection',
  description: 'A powerful machine learning platform to detect and prevent credit card fraud using Random Forest classification.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-gradient" />
        {children}
      </body>
    </html>
  )
}
