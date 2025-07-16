import React from 'react';
import ReactMarkdown from 'react-markdown';

const markdown = `
# Terms & Services

Welcome to my portfolio! By using this site, you agree to the following:

## Usage
- This site is for personal, non-commercial use only.
- All content is owned by Onxy unless otherwise stated.

## Privacy
- No personal data is collected or stored.
- Contact form submissions are sent directly to my email.

## Security
- All reasonable measures are taken to protect your data.
- No guarantees are made regarding third-party links.

## Contact
For questions, email: onxy@example.com
`;

const Terms = () => {
  return (
    <div className="h-full w-full overflow-auto p-4 bg-glass rounded-lg shadow-glass border border-white/10">
      <ReactMarkdown className="prose prose-invert max-w-none text-white/90">
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default Terms; 