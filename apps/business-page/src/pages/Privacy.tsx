import './Privacy.css'

export default function Privacy() {

  return (
    <div className="wrapper">
      <div className="content-header">
        <h4>Privacy Policy</h4>
      </div>
      <div className="content">
        <p>Effective Date: 7/28/2025</p>
        <p>
          <strong>SimplizityLife Calendar</strong> ("we", "our", or "us") respects your privacy. This privacy Policy explains what data we collect, how we use it, and
          your rights regarding that data.
        </p>

        <h5>1. What We Collect</h5>
        <p>We collect the following data when you use our app.</p>
        <ul>
          <li>Family name and family member names</li>
          <li>Calendar events, chores, rewards, recipes, meal planner items, shopping lists</li>
          <li>Email address (for login)</li>
          <li>Subscription status and limited billing metadata</li>
          <li>Credit card information (handled securely by Stripe)</li>
        </ul>

        <h5>2. How We Use Your Data</h5>
        <p>We use your data to:</p>
        <ul>
          <li>Provide and improve app functionality</li>
          <li>Authenticate users via Firebase Authentication</li>
          <li>Process subscriptions and payments through Stripe</li>
          <li>Maintain a personalized family calendar experience</li>
        </ul>

        <h5>3. Third Party Services</h5>
        <p>We use:</p>
        <ul>
          <li><strong>Firebase</strong> for hosting, authentication, and database storage</li>
          <li><strong>Stripe</strong> for managing subscriptions and billing</li>
        </ul>
        <p>Only necessary data is shared with these services (e.g., subscription metadata). We <strong>do not sell your data.</strong></p>

        <h5>4. Children's Privacy</h5>
        <p>
          SimplizityLife is designed to be used by families through a single shared login. We do <strong>not</strong> create or manage individual user accounts for children.
          All data (including names, events, chores, lists, recipes, meals) is entered by the primary account holder or anyone they choose to share their login with (e.g.,
          another caregiver or family member).
        </p>
        <p>
          We do not knowingly collect personal information from children. Any child-related data, such as a child's name or event, is visible only to the authenticated
          family account and is never analyzed, used for profiling, or shared externally. As developers, we do not access or interact with this content unless required
          for support or by law.
        </p>

        <h5>5. Data Control and Deletion</h5>
        <p>
          You have full control of the information stored in your account. You may delete individual entries such as events, chores, family members, rewards, and other
          information at any time through the app interface.
        </p>
        <p>
          You also have full control over your <strong>subscription status</strong>. A <strong>Subscribe</strong> button is available to initiate a subscription, and
          subscribed users can <strong>cancel their subscription</strong> at any time through the app.
        </p>
        <p>
          However, <strong>account deletion (including removal of your email and subscription record)</strong> is not currently available through the app. If you wish to
          delete your account entirely, please <strong>cancel your subscription</strong> then <strong>contact us directly</strong> to request permanent deletion of
          your account and all associated data, except where retention is required by law.
        </p>

        <h5>6. Data Retention</h5>
        <p>
          If you cancel your subscription, your accout will remain active until the end of the billing period. Canceling your subscribtion moves you to the "free"
          version of the app. See bullet point 5. for account deletion. After deletion, data may be retained for legal and operational purposes, unless requested
          otherwise.
        </p>

        <h5>7. Contact Us</h5>
        <p>
          Questions? Reach out at <a href="mailto:support@simplizitylife.com">support@simplizitylife.com</a>
        </p>
      </div>
    </div>
  )
}
