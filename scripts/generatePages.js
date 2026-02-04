/**
 * Page Generator Script
 * This script generates all the frontend pages based on the implementation plan
 * Run with: node scripts/generatePages.js
 */

const fs = require('fs');
const path = require('path');

// Page templates
const pageTemplates = {
    list: (title, apiCall) => `import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';

export default function ${title}Page() {
  const { data, loading, error, execute } = useApi(apiService.${apiCall}.list);

  useEffect(() => {
    execute();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>${title}</Typography>
        {/* Add your list UI here */}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Box>
    </Container>
  );
}`,

    detail: (title, apiCall) => `import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import apiService from '../../../utils/apiService';
import { useApi } from '../../../hooks/useApi';

export default function ${title}DetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, error, execute } = useApi(apiService.${apiCall}.get);

  useEffect(() => {
    if (id) execute(id);
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>${title} Details</Typography>
        {/* Add your detail UI here */}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Box>
    </Container>
  );
}`,

    form: (title, apiCall) => `import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import { useFormSubmit } from '../../../hooks/useApi';
import apiService from '../../../utils/apiService';

export default function ${title}FormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const { loading, error, success, submit } = useFormSubmit(apiService.${apiCall}.create);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submit(formData);
    if (result.success) {
      router.push('/admin/${apiCall}');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Create ${title}</Typography>
        <form onSubmit={handleSubmit}>
          {/* Add your form fields here */}
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </form>
      </Box>
    </Container>
  );
}`
};

// Define all pages to generate
const pagesToGenerate = [
    // Account pages
    { path: 'pages/account/profile.js', template: 'detail', title: 'Profile', apiCall: 'users' },
    { path: 'pages/account/addresses.js', template: 'list', title: 'Addresses', apiCall: 'userProfile' },
    { path: 'pages/account/preferences.js', template: 'detail', title: 'Preferences', apiCall: 'userProfile' },
    { path: 'pages/account/wishlist.js', template: 'list', title: 'Wishlist', apiCall: 'userProfile' },
    { path: 'pages/account/notifications.js', template: 'list', title: 'Notifications', apiCall: 'userProfile' },
    { path: 'pages/account/devices.js', template: 'list', title: 'Devices', apiCall: 'userProfile' },
    { path: 'pages/account/security.js', template: 'detail', title: 'Security', apiCall: 'userProfile' },
    { path: 'pages/account/sessions.js', template: 'list', title: 'Sessions', apiCall: 'auth' },
    { path: 'pages/account/api-keys.js', template: 'list', title: 'API Keys', apiCall: 'auth' },

    // Admin - Users
    { path: 'pages/admin/users/index.js', template: 'list', title: 'Users', apiCall: 'users' },

    // Admin - Products (additional pages)
    { path: 'pages/admin/products/create.js', template: 'form', title: 'Product', apiCall: 'products' },

    // Admin - Collections
    { path: 'pages/admin/collections/index.js', template: 'list', title: 'Collections', apiCall: 'collections' },

    // Admin - Tags & Attributes
    { path: 'pages/admin/catalog/tags.js', template: 'list', title: 'Tags', apiCall: 'tags' },
    { path: 'pages/admin/catalog/attributes.js', template: 'list', title: 'Attributes', apiCall: 'attributes' },

    // Admin - Payments
    { path: 'pages/admin/payments/index.js', template: 'list', title: 'Payments', apiCall: 'payments' },

    // Admin - Shipping
    { path: 'pages/admin/shipping/carriers.js', template: 'list', title: 'Shipping Carriers', apiCall: 'shipping' },
    { path: 'pages/admin/shipping/labels.js', template: 'list', title: 'Shipping Labels', apiCall: 'shipping' },

    // Admin - Promotions
    { path: 'pages/admin/promotions/coupons.js', template: 'list', title: 'Coupons', apiCall: 'coupons' },
    { path: 'pages/admin/promotions/campaigns.js', template: 'list', title: 'Campaigns', apiCall: 'promotions' },

    // Admin - Vendors
    { path: 'pages/admin/vendors/index.js', template: 'list', title: 'Vendors', apiCall: 'vendors' },

    // Admin - Finance
    { path: 'pages/admin/finance/taxes.js', template: 'list', title: 'Tax Management', apiCall: 'finance' },
    { path: 'pages/admin/finance/invoices.js', template: 'list', title: 'Invoices', apiCall: 'finance' },
    { path: 'pages/admin/finance/ledger.js', template: 'list', title: 'General Ledger', apiCall: 'finance' },
    { path: 'pages/admin/finance/payouts.js', template: 'list', title: 'Payouts', apiCall: 'finance' },
    { path: 'pages/admin/finance/reconciliation.js', template: 'list', title: 'Reconciliation', apiCall: 'finance' },
    { path: 'pages/admin/finance/reports.js', template: 'list', title: 'Financial Reports', apiCall: 'finance' },

    // Admin - Search & AI
    { path: 'pages/admin/search/configuration.js', template: 'detail', title: 'Search Configuration', apiCall: 'search' },
    { path: 'pages/admin/recommendations/settings.js', template: 'detail', title: 'Recommendations', apiCall: 'recommendations' },
    { path: 'pages/admin/ai/pricing.js', template: 'list', title: 'Dynamic Pricing', apiCall: 'ai' },
    { path: 'pages/admin/ai/fraud.js', template: 'list', title: 'Fraud Detection', apiCall: 'ai' },
    { path: 'pages/admin/ai/analytics.js', template: 'list', title: 'AI Analytics', apiCall: 'ai' },

    // Admin - Support
    { path: 'pages/admin/support/tickets/index.js', template: 'list', title: 'Support Tickets', apiCall: 'support' },
    { path: 'pages/admin/support/configuration.js', template: 'detail', title: 'Support Configuration', apiCall: 'support' },
    { path: 'pages/admin/support/knowledge-base.js', template: 'list', title: 'Knowledge Base', apiCall: 'support' },

    // Admin - Marketing
    { path: 'pages/admin/marketing/campaigns/index.js', template: 'list', title: 'Marketing Campaigns', apiCall: 'marketing' },
    { path: 'pages/admin/marketing/segments.js', template: 'list', title: 'Customer Segments', apiCall: 'marketing' },
    { path: 'pages/admin/marketing/ab-tests.js', template: 'list', title: 'A/B Tests', apiCall: 'marketing' },
    { path: 'pages/admin/marketing/referrals.js', template: 'list', title: 'Referral Program', apiCall: 'marketing' },
    { path: 'pages/admin/marketing/loyalty.js', template: 'list', title: 'Loyalty Program', apiCall: 'marketing' },
    { path: 'pages/admin/marketing/gift-cards.js', template: 'list', title: 'Gift Cards', apiCall: 'marketing' },

    // Admin - RMA
    { path: 'pages/admin/rma/index.js', template: 'list', title: 'RMA', apiCall: 'rma' },
    { path: 'pages/admin/rma/configuration.js', template: 'detail', title: 'RMA Configuration', apiCall: 'rma' },

    // Admin - Compliance
    { path: 'pages/admin/compliance/gdpr.js', template: 'list', title: 'GDPR Requests', apiCall: 'compliance' },
    { path: 'pages/admin/compliance/policies.js', template: 'list', title: 'Compliance Policies', apiCall: 'compliance' },
    { path: 'pages/admin/compliance/export-controls.js', template: 'list', title: 'Export Controls', apiCall: 'compliance' },

    // Admin - Legal
    { path: 'pages/admin/legal/documents.js', template: 'list', title: 'Legal Documents', apiCall: 'legal' },
    { path: 'pages/admin/legal/disputes.js', template: 'list', title: 'Legal Disputes', apiCall: 'legal' },

    // Admin - Integrations
    { path: 'pages/admin/integrations/index.js', template: 'list', title: 'Integrations', apiCall: 'integrations' },
    { path: 'pages/admin/integrations/webhooks.js', template: 'list', title: 'Webhooks', apiCall: 'webhooks' },
    { path: 'pages/admin/integrations/etl.js', template: 'list', title: 'ETL Operations', apiCall: 'etl' },

    // Admin - B2B
    { path: 'pages/admin/b2b/accounts.js', template: 'list', title: 'B2B Accounts', apiCall: 'b2b' },
    { path: 'pages/admin/b2b/contracts.js', template: 'list', title: 'Contracts', apiCall: 'b2b' },
    { path: 'pages/admin/b2b/quotes.js', template: 'list', title: 'Quotes', apiCall: 'b2b' },
    { path: 'pages/admin/b2b/credit.js', template: 'list', title: 'Credit Management', apiCall: 'b2b' },
    { path: 'pages/admin/b2b/purchase-orders.js', template: 'list', title: 'Purchase Orders', apiCall: 'b2b' },

    // Admin - Platform
    { path: 'pages/admin/platform/feature-flags.js', template: 'list', title: 'Feature Flags', apiCall: 'admin' },
    { path: 'pages/admin/platform/configuration.js', template: 'detail', title: 'Platform Configuration', apiCall: 'admin' },
    { path: 'pages/admin/platform/jobs.js', template: 'list', title: 'Background Jobs', apiCall: 'admin' },
    { path: 'pages/admin/platform/monitoring.js', template: 'detail', title: 'System Monitoring', apiCall: 'admin' },

    // Admin - CMS (additional pages)
    { path: 'pages/admin/cms/blocks.js', template: 'list', title: 'Content Blocks', apiCall: 'cms' },
    { path: 'pages/admin/cms/menus.js', template: 'list', title: 'Navigation Menus', apiCall: 'cms' },
    { path: 'pages/admin/cms/banners.js', template: 'list', title: 'Banners', apiCall: 'cms' },
    { path: 'pages/admin/cms/landing-pages.js', template: 'list', title: 'Landing Pages', apiCall: 'cms' },
    { path: 'pages/admin/cms/redirects.js', template: 'list', title: 'URL Redirects', apiCall: 'cms' },
    { path: 'pages/admin/cms/assets.js', template: 'list', title: 'Media Assets', apiCall: 'cms' },
    { path: 'pages/admin/cms/forms.js', template: 'list', title: 'Lead Forms', apiCall: 'cms' },
    { path: 'pages/admin/cms/announcements.js', template: 'list', title: 'Announcements', apiCall: 'cms' },

    // Admin - I18n
    { path: 'pages/admin/i18n/locales.js', template: 'list', title: 'Locales', apiCall: 'i18n' },
    { path: 'pages/admin/i18n/translations.js', template: 'list', title: 'Translations', apiCall: 'i18n' },

    // Admin - Channels & Stores
    { path: 'pages/admin/channels/index.js', template: 'list', title: 'Sales Channels', apiCall: 'channels' },
    { path: 'pages/admin/stores/index.js', template: 'list', title: 'Physical Stores', apiCall: 'stores' },
    { path: 'pages/admin/zones/pricing.js', template: 'list', title: 'Price Zones', apiCall: 'zones' },
    { path: 'pages/admin/zones/shipping.js', template: 'list', title: 'Shipping Zones', apiCall: 'zones' },

    // Admin - CRM Entity Designer
    { path: 'pages/admin/crm/entities/index.js', template: 'list', title: 'Entities', apiCall: 'entities' },

    // Admin - CRM Audit
    { path: 'pages/admin/crm/audit/index.js', template: 'list', title: 'Audit Logs', apiCall: 'audit' },
    { path: 'pages/admin/crm/audit/configuration.js', template: 'detail', title: 'Audit Configuration', apiCall: 'audit' },

    // Admin - CRM Workflows
    { path: 'pages/admin/crm/workflows/index.js', template: 'list', title: 'Workflows', apiCall: 'workflows' },
    { path: 'pages/admin/crm/workflows/health.js', template: 'detail', title: 'Workflow Health', apiCall: 'workflows' },

    // Admin - CRM Rules
    { path: 'pages/admin/crm/rules/index.js', template: 'list', title: 'Business Rules', apiCall: 'rules' },
    { path: 'pages/admin/crm/rules/management.js', template: 'detail', title: 'Rules Management', apiCall: 'rules' },

    // Admin - CRM Reports
    { path: 'pages/admin/crm/reports/index.js', template: 'list', title: 'Reports', apiCall: 'reports' },
    { path: 'pages/admin/crm/dashboards/index.js', template: 'list', title: 'Dashboards', apiCall: 'dashboards' },
    { path: 'pages/admin/crm/bi/datasets.js', template: 'list', title: 'BI Datasets', apiCall: 'bi' },
    { path: 'pages/admin/crm/bi/queries.js', template: 'list', title: 'Saved Queries', apiCall: 'bi' },
];

// Generate pages
console.log('Generating pages...');
let created = 0;
let skipped = 0;

pagesToGenerate.forEach(page => {
    const fullPath = path.join(__dirname, '..', page.path);
    const dir = path.dirname(fullPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Check if file already exists
    if (fs.existsSync(fullPath)) {
        console.log(`Skipped (exists): ${page.path}`);
        skipped++;
        return;
    }

    // Generate content
    const content = pageTemplates[page.template](page.title, page.apiCall);

    // Write file
    fs.writeFileSync(fullPath, content);
    console.log(`Created: ${page.path}`);
    created++;
});

console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
