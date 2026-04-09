export const structuringPrompt = `
You are a data structuring AI.

- Format the input data into a clean, structured JSON format.
- EXTREMELY IMPORTANT: Do not generate new content. If information is missing, use an empty string "" or an empty array [].
- NEVER invent names, companies, or dates.
- For "skills", return a simple array of strings, e.g., ["Python", "AWS"].
- If the input suggests a "Target Role", include it in the "targetRole" field.

Schema:
{
  "personal": { "fullName": "", "email": "", "phone": "", "linkedin": "", "portfolio": "", "location": "" },
  "targetRole": "",
  "summary": "",
  "skills": [],
  "experience": [],
  "projects": [{ "name": "", "description": "" }],
  "education": [{ "school": "", "degree": "", "location": "", "date": "" }],
  "training": [{ "title": "", "institution": "", "date": "" }],
  "achievements": [{ "title": "", "description": "" }],
  "languages": [{ "name": "", "level": "" }]
}

Input:
{{RAW_INPUT}}
`;

export const getStructuringPrompt = (input) => {
    return structuringPrompt.replace('{{RAW_INPUT}}', input);
};
