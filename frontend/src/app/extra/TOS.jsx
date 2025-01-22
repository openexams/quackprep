import MarkdownRenderer from '@components/MarkdownRenderer';
import { Segment } from 'semantic-ui-react';
export default function TOS() {
  return (
    <Segment basic>
      <MarkdownRenderer
        render={`# **Terms of Service**

**Effective Date:** 2025-01-22

Welcome to QuackPrep.com ("we," "us," or "our"). By accessing or using QuackPrep.com (the "Site"), you agree to comply with and be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Site.

---

### 1. **Eligibility**

By using the Site, you confirm that you are at least 13 years old. If you are under 18, you must have your parent or guardian’s consent to use the Site.

---

### 2. **User Accounts**

1. **Account Responsibility**: You are responsible for maintaining the confidentiality of your account credentials and all activities that occur under your account.
2. **Unauthorized Access**: You agree to notify us immediately of any unauthorized access to your account.

---

### 3. **Content Ownership and Intellectual Property**

1. **Our Content**: All content provided on the Site, including questions, videos, designs, and other materials, is owned by QuackPrep.com or its licensors. You may not copy, modify, distribute, or sell any part of the Site without our prior written consent.
2. **Your Content**: By uploading content (e.g., past exams or other materials), you retain ownership of your content but grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content on the Site.

---

### 4. **User Conduct**

You agree not to:

1. Upload, share, or distribute content that you do not have the right to share.
2. Post or share any content that is illegal, harmful, offensive, or violates the rights of others.
3. Use the Site for any unauthorized or unlawful purpose, including spamming or hacking.
4. Interfere with or disrupt the Site’s operations.

---

### 5. **Uploaded Content (User-Generated Content)**

1. **Guidelines**: Users must ensure they have the right to upload any content shared on the Site.
2. **Review and Removal**: We reserve the right to review, modify, or remove any content that violates these Terms or applicable laws.

---

### 6. **Disclaimers and Limitation of Liability**

1. **As-Is Basis**: The Site is provided “as-is” without warranties of any kind, either express or implied.
2. **No Guarantees**: We do not guarantee academic success or outcomes from using the Site.
3. **Limitation of Liability**: To the fullest extent permitted by law, QuackPrep.com is not liable for any indirect, incidental, or consequential damages arising out of your use of the Site.

---

### 7. **Payment and Subscriptions** (if applicable)

1. **Billing**: If you purchase any paid services, you agree to provide accurate and complete billing information.
2. **Refunds**: Refunds are currently not provided.
3. **Cancellation**: You may cancel subscriptions at any time, but access to paid features will cease at the end of the billing cycle.

---

### 8. **Third-Party Services**

The Site may integrate with third-party services (e.g., Google login, payment processors). We are not responsible for the functionality or policies of these services.

---

### 9. **Termination**

We reserve the right to suspend or terminate your account if you violate these Terms or engage in behavior harmful to the Site or its users.

---

### 10. **Privacy**

Your use of the Site is also governed by our Privacy Policy, which explains how we collect, store, and use your data. Please review it [insert link].

---

### 11. **Changes to the Terms**

We may update these Terms from time to time. Significant changes will be communicated via email or a prominent notice on the Site. Continued use of the Site after changes indicates your acceptance of the updated Terms.

---

### 12. **Governing Law**

These Terms are governed by the laws of the US, without regard to conflict of law principles.

---

### 13. **Contact Us**

For any questions or concerns about these Terms, please contact us at:

**Email**: quackprep@gmail.com

---

Thank you for using QuackPrep.com!

`}
      />
    </Segment>
  );
}
