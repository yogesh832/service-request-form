export const dummyTickets = [
  {
    id: "ticket_1",
    title: "Login issue on mobile app",
    description: "I'm unable to login to the mobile application. It keeps showing invalid credentials error even though I'm sure my password is correct.",
    status: "open",
    priority: "high",
    category: "technical",
    company: "Acme Corp",
    user: "user_1",
    createdAt: "2023-06-01T09:15:00Z",
    attachments: []
  },
  {
    id: "ticket_2",
    title: "Invoice discrepancy",
    description: "My latest invoice shows incorrect charges for premium features I didn't subscribe to.",
    status: "pending",
    priority: "medium",
    category: "billing",
    company: "Acme Corp",
    user: "user_1",
    assignedTo: "user_3",
    createdAt: "2023-05-28T14:30:00Z",
    attachments: [
      { originalname: "invoice_june.pdf" }
    ]
  },
  {
    id: "ticket_3",
    title: "Feature request: Dark mode",
    description: "Please add a dark mode option to the dashboard interface. It would help reduce eye strain during night-time usage.",
    status: "open",
    priority: "low",
    category: "general",
    company: "Globex Inc",
    user: "user_4",
    createdAt: "2023-06-05T11:20:00Z",
    attachments: []
  },
  {
    id: "ticket_4",
    title: "API connection timeout",
    description: "Our integration is timing out when connecting to the API endpoint. This started happening after the recent update.",
    status: "resolved",
    priority: "high",
    category: "technical",
    company: "Globex Inc",
    user: "user_4",
    assignedTo: "user_5",
    createdAt: "2023-05-20T16:45:00Z",
    attachments: [
      { originalname: "error_logs.txt" },
      { originalname: "api_config.png" }
    ]
  },
  {
    id: "ticket_5",
    title: "Account upgrade request",
    description: "I'd like to upgrade my account to the enterprise plan. Please provide details on the process.",
    status: "pending",
    priority: "medium",
    category: "account",
    company: "Acme Corp",
    user: "user_1",
    assignedTo: "user_3",
    createdAt: "2023-06-03T10:05:00Z",
    attachments: []
  }
];