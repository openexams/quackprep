import MarkdownRenderer from '@components/MarkdownRenderer';
import { Segment } from 'semantic-ui-react';
export default function PrivacyPolicy() {
  return (
    <Segment basic>
      <MarkdownRenderer
        render={`# **Privacy Policy**

**Effective Date:** 2025-01-22

QuackPrep.com ("we," "us," or "our") values your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you access or use QuackPrep.com (the "Site"). By using the Site, you agree to the collection and use of information in accordance with this policy.

---

### 1. **Information We Collect**

We collect the following types of information:

1. **User-Generated Content:**
   - Content you upload to the Site, such as past exams, questions, comments, or other materials.

2. **Analytics Data:**
   - Information about your interaction with the Site, including:
     - IP address.
     - Browser type and version.
     - Pages you visit on the Site.
     - Time and date of your visit.
     - Referring URLs and search terms.
     - Other diagnostic data.

---

### 2. **How We Collect Information**

1. **Direct Submission:**
   - When you upload content, register for an account, or communicate with us.

2. **Automatic Collection:**
   - Through cookies and similar technologies that track usage patterns.

---

### 3. **How We Use Your Information**

We use the collected information to:

1. Provide, maintain, and improve the Site’s features and services.
2. Analyze user behavior and trends to enhance user experience.
3. Communicate with you, including sending updates, notifications, or responding to inquiries.
4. Ensure compliance with our Terms of Service.

---

### 4. **Cookies and Tracking Technologies**

We use cookies and similar tracking technologies to collect analytics data. Cookies are small files placed on your device to:

1. Enhance the functionality of the Site.
2. Remember your preferences and settings.
3. Collect usage data to improve the Site.

You can manage or disable cookies in your browser settings. Note that disabling cookies may affect the functionality of the Site.

---

### 5. **How We Share Your Information**

We do not sell your personal information. However, we may share your information in the following circumstances:

1. **With Service Providers:**
   - Third-party providers that assist us in analyzing usage data or maintaining the Site.

2. **As Required by Law:**
   - To comply with legal obligations or protect our rights.

3. **In Business Transfers:**
   - If we are involved in a merger, acquisition, or asset sale, your information may be transferred.

---

### 6. **Data Storage and Security**

We take reasonable measures to protect your data from unauthorized access, alteration, or destruction. However, no method of transmission over the Internet or method of electronic storage is completely secure. While we strive to protect your personal information, we cannot guarantee absolute security.

---

### 7. **Your Rights**

Depending on your location, you may have the following rights regarding your data:

1. Access your personal data.
2. Request correction or deletion of your personal data.
3. Object to the processing of your data.
4. Withdraw consent for data collection.

To exercise these rights, contact us at quackprep@gmail.com.

---

### 8. **Children’s Privacy**

The Site is not intended for individuals under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child under 13, we will take steps to delete it promptly.

---

### 9. **Changes to This Privacy Policy**

We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.

---

### 10. **Contact Us**

If you have any questions or concerns about this Privacy Policy, please contact us at:

**Email:** quackprep@gmail.com

---

Thank you for trusting QuackPrep.com with your information.



`}
      />
    </Segment>
  );
}
