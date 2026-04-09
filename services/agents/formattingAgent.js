export const formattingPrompt = `
You are a resume formatter.

Rules:
- No tables or columns
- Clean ATS structure
- HTML-safe format

Output:
{
  "header": {},
  "sections": []
}

Input:
{{ATS_JSON}}
`;

export const getFormattingPrompt = (json) => {
    return formattingPrompt.replace('{{ATS_JSON}}', JSON.stringify(json, null, 2));
};
