export default function Home() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
      <h1 style={{ fontSize: 48 }}>Email SaaS Platform</h1>
      <p style={{ fontSize: 20, color: "#666", marginBottom: 32 }}>Next.js 14 + Prisma + Resend. Transactional emails, templates, workflows, and contact management.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, textAlign: "left" }}>
        {[["📧 Templates", "4 built-in email templates with variable substitution"],
          ["📊 Email Logs", "Track sends, opens, and clicks per user"],
          ["👥 Contacts", "Contact management with tags and metadata"],
          ["⚡ Workflows", "Multi-step email automation with conditions"]].map(([t, d]) => (
          <div key={t} style={{ padding: 20, border: "1px solid #e5e7eb", borderRadius: 12 }}>
            <h3>{t}</h3><p style={{ color: "#666", fontSize: 14 }}>{d}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
