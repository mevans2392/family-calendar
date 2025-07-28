import './Privacy.css'

export default function Terms() {
  return (
    <div className="wrapper">
      <div className="content-header">
        <h4>Terms of Use</h4>
      </div>
      <div className="content">
        <p>Last updated: 7/28/2025</p>
        <p>
          Welcome to SimplizityLife Calendar! By accessing or using our services, including the app
          (<a href="https://familycalendar-2a3ec.web.app">https://familycalendar-2a3ec.web.app</a>) and website (simplizitylife.com), you agree to be bound by these Terms of Use.
        </p>

        <h5>1. Account Usage</h5>
        <ul>
          <li>
            Each family subscription is tied to a single login (email/password). You may share your account with household members (e.g., partner,
            caregiver, grandparent).
          </li>
          <li>Do not share your login with individuals outside of your family.</li>
        </ul>

        <h5>2. User Responsibilities</h5>
        <ul>
          <li>
            You are responsible for all content added to your account including, but not limited to, events, names, chores, meals, rewards, and shopping lists.
          </li>
          <li>
            You agree not to use the app for unlawful purposes or to store harmful or abusive content.
          </li>
        </ul>

        <h5>3. Subscription and Billing</h5>
        <ul>
          <li>Subscription plans are managed through Stripe. You may subscribe or cancel at any time through the app interface.</li>
          <li>Upon cancellation, your subscription status will remain 'paid' through the end of the current billing cycle.</li>
          <li><strong>Refund Policy:</strong> We do not issue refunds for subscriptions that have been paid for 60 days or more.</li>
        </ul>

        <h5>4. Data and Deletion</h5>
        <ul>
          <li>You may delete your calendar data at any time through the app interface.</li>
          <li>
            To delete your account entirely, please contact us at <a href="mailto:support@simplizitylife.com">support@simplizitylife.com</a>.
          </li>
          <li>Account deletion will remove your login and all associated data, except where retention is required by law.</li>
        </ul>

        <h5>5. Service Availability</h5>
        <ul>
          <li>We aim to provide reliable service but cannot guarantee uninterrupted access.</li>
          <li>Features may change, improve, or be removed at any time.</li>
        </ul>

        <h5>6. Modifications</h5>
        <ul>
          <li>We may update these Terms at any time. Continued use of the app after updates means you agree to the revised terms.</li>
        </ul>

        <h5>7. Contact Us</h5>
        <p>Questions? Email us at: <a href="mailto:support@simplizitylife.com">support@simplizitylife.com</a></p>
      </div>
    </div>
  )
}
