import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
}

export async function sendEmail(params: SendEmailParams) {
  const { data, error } = await resend.emails.send({
    from: params.from ?? process.env.EMAIL_FROM ?? "noreply@example.com",
    to: params.to,
    subject: params.subject,
    html: params.html,
    reply_to: params.replyTo,
    tags: params.tags,
  });

  if (error) throw new Error(`Email send failed: ${error.message}`);
  return data;
}

export function renderTemplate(template: string, variables: Record<string, string>): string {
  let rendered = template;
  for (const [key, value] of Object.entries(variables)) {
    rendered = rendered.replaceAll(`{{${key}}}`, value);
  }
  return rendered;
}

// ─── Email Templates ────────────────────────────────────

export const TEMPLATES = {
  welcome: {
    subject: "Welcome to {{appName}}!",
    body: `<h1>Welcome, {{name}}!</h1><p>Thanks for signing up for {{appName}}. We're excited to have you.</p><p><a href="{{dashboardUrl}}">Go to Dashboard</a></p>`,
    variables: ["name", "appName", "dashboardUrl"],
  },
  passwordReset: {
    subject: "Reset your password",
    body: `<h1>Password Reset</h1><p>Hi {{name}}, click the link below to reset your password:</p><p><a href="{{resetUrl}}">Reset Password</a></p><p>This link expires in 1 hour.</p>`,
    variables: ["name", "resetUrl"],
  },
  teamInvite: {
    subject: "You've been invited to {{teamName}}",
    body: `<h1>Team Invitation</h1><p>{{inviterName}} has invited you to join {{teamName}}.</p><p><a href="{{inviteUrl}}">Accept Invitation</a></p>`,
    variables: ["inviterName", "teamName", "inviteUrl"],
  },
  weeklyDigest: {
    subject: "Your weekly summary for {{appName}}",
    body: `<h1>Weekly Summary</h1><p>Hi {{name}}, here's what happened this week:</p><ul><li>{{metric1}}</li><li>{{metric2}}</li><li>{{metric3}}</li></ul>`,
    variables: ["name", "appName", "metric1", "metric2", "metric3"],
  },
} as const;

// ─── Workflow Engine ────────────────────────────────────

export interface WorkflowStep {
  type: "send_email" | "wait" | "condition" | "update_contact";
  config: Record<string, unknown>;
}

export async function executeWorkflow(steps: WorkflowStep[], context: Record<string, string>): Promise<{ executed: number; results: Array<{ step: number; status: string }> }> {
  const results: Array<{ step: number; status: string }> = [];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]!;
    try {
      switch (step.type) {
        case "send_email": {
          const template = step.config["template"] as string;
          const tmpl = TEMPLATES[template as keyof typeof TEMPLATES];
          if (tmpl) {
            const subject = renderTemplate(tmpl.subject, context);
            const html = renderTemplate(tmpl.body, context);
            await sendEmail({ to: context["email"] ?? "", subject, html });
          }
          results.push({ step: i, status: "sent" });
          break;
        }
        case "wait": {
          // In production: schedule next step via job queue
          results.push({ step: i, status: "scheduled" });
          break;
        }
        case "condition": {
          results.push({ step: i, status: "evaluated" });
          break;
        }
        case "update_contact": {
          results.push({ step: i, status: "updated" });
          break;
        }
      }
    } catch (error) {
      results.push({ step: i, status: `failed: ${error}` });
    }
  }

  return { executed: results.length, results };
}
