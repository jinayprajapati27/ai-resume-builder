import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } from "docx";

/**
 * Generates a native DOCX buffer from resume data
 * @param {object} data 
 * @returns {Promise<Buffer>}
 */
export const generateDocx = async (data) => {
    const p = data.personal || {};
    
    // Helper for Section Titles with Underline
    const createSectionTitle = (title) => {
        return new Paragraph({
            children: [
                new TextRun({
                    text: title.toUpperCase(),
                    bold: true,
                    size: 22,
                    color: "a78bfa", // Purple theme
                }),
            ],
            border: {
                bottom: {
                    color: "e9d8fd",
                    space: 1,
                    style: BorderStyle.SINGLE,
                    size: 10,
                },
            },
            spacing: { before: 400, after: 200 },
        });
    };

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // ─── Header ───
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: (p.fullName || "").toUpperCase(),
                            bold: true,
                            size: 48,
                            font: "Source Serif 4",
                        }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: data.targetRole || p.title || "",
                            size: 24,
                            bold: true,
                            color: "6b7280",
                        }),
                    ],
                    spacing: { after: 100 },
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: `${p.email}  •  ${p.phone}  •  ${p.location}`,
                            size: 19,
                            color: "9ca3af",
                        }),
                    ],
                    spacing: { after: 400 },
                }),

                // ─── Summary ───
                ...(data.summary ? [
                    createSectionTitle("Summary"),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: data.summary,
                                size: 20,
                            }),
                        ],
                        spacing: { after: 300 },
                    }),
                ] : []),

                // ─── Experience ───
                createSectionTitle("Experience"),
                ...(data.experience || []).map(exp => {
                    return [
                        new Table({
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            borders: {
                                top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                                left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
                                insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
                            },
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph({ children: [new TextRun({ text: exp.company || exp.organization || "", bold: true, size: 21 })] })],
                                        }),
                                        new TableCell({
                                            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: exp.location || "", size: 19, italics: true })] })],
                                        }),
                                    ],
                                }),
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph({ children: [new TextRun({ text: exp.title || exp.role || "", italics: true, size: 20 })] })],
                                        }),
                                        new TableCell({
                                            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: exp.date || exp.duration || "", size: 19, bold: true })] })],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        ...(Array.isArray(exp.description) ? exp.description : [exp.description]).map(bullet => 
                            new Paragraph({
                                text: bullet,
                                bullet: { level: 0 },
                                spacing: { before: 50 },
                            })
                        ),
                        new Paragraph({ spacing: { after: 150 } })
                    ];
                }).flat(),

                // ─── Projects ───
                ...(data.projects && data.projects.length ? [
                    createSectionTitle("Projects"),
                    ...data.projects.map(proj => {
                        return [
                            new Table({
                                width: { size: 100, type: WidthType.PERCENTAGE },
                                borders: {
                                    top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                                    left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
                                    insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
                                },
                                rows: [
                                    new TableRow({
                                        children: [
                                            new TableCell({
                                                children: [new Paragraph({ children: [new TextRun({ text: proj.name || proj.title || "", bold: true, size: 21 })] })],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            ...(Array.isArray(proj.description) ? proj.description : [proj.description]).filter(Boolean).map(bullet => 
                                new Paragraph({
                                    text: bullet,
                                    bullet: { level: 0 },
                                    spacing: { before: 50 },
                                })
                            ),
                            new Paragraph({ spacing: { after: 150 } })
                        ];
                    }).flat()
                ] : []),

                // ─── Key Achievements (3-column layout) ───
                ...(data.achievements && data.achievements.length ? [
                    createSectionTitle("Key Achievements"),
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
                            insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
                        },
                        rows: [
                            new TableRow({
                                children: data.achievements.slice(0, 3).map(ach => new TableCell({
                                    children: [
                                        new Paragraph({ children: [new TextRun({ text: ach.title || "", bold: true, size: 20 })] }),
                                        new Paragraph({ children: [new TextRun({ text: ach.description || ach.desc || "", size: 18, color: "4b5563" })] }),
                                    ],
                                    width: { size: 33, type: WidthType.PERCENTAGE }
                                }))
                            })
                        ]
                    })
                ] : []),

                // ─── Skills ───
                createSectionTitle("Skills"),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: Array.isArray(data.skills) ? data.skills.join(", ") : (data.skills || ""),
                            size: 20,
                        }),
                    ],
                }),

                // ─── Training / Courses ───
                ...(data.training && data.training.length ? [
                    createSectionTitle("Training / Courses"),
                    ...data.training.map(t => {
                        return [
                            new Table({
                                width: { size: 100, type: WidthType.PERCENTAGE },
                                borders: {
                                    top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                                    left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
                                    insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
                                },
                                rows: [
                                    new TableRow({
                                        children: [
                                            new TableCell({
                                                children: [new Paragraph({ children: [new TextRun({ text: t.title || "", bold: true, size: 21 })] })],
                                            }),
                                            new TableCell({
                                                children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: t.institution || t.org || "", size: 19, italics: true })] })],
                                            }),
                                        ],
                                    }),
                                    new TableRow({
                                        children: [
                                            new TableCell({
                                                children: [new Paragraph({ children: [new TextRun({ text: "Completion Certificate", italics: true, size: 18, color: "6b7280" })] })],
                                            }),
                                            new TableCell({
                                                children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: t.date || "", size: 19, bold: true })] })],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            new Paragraph({ spacing: { after: 150 } })
                        ];
                    }).flat()
                ] : []),

                // ─── Education ───
                createSectionTitle("Education"),
                ...(data.education || []).map(edu => {
                    return [
                        new Table({
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            borders: {
                                top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                                left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
                                insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
                            },
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph({ children: [new TextRun({ text: edu.school || edu.university || "", bold: true, size: 21 })] })],
                                        }),
                                        new TableCell({
                                            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: edu.location || "", size: 19 })] })],
                                        }),
                                    ],
                                }),
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph({ children: [new TextRun({ text: edu.degree || "", italics: true, size: 20 })] })],
                                        }),
                                        new TableCell({
                                            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: edu.date || edu.year || "", size: 19, bold: true })] })],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new Paragraph({ spacing: { after: 150 } })
                    ];
                }).flat(),

                // ─── Languages ───
                ...(data.languages && data.languages.length ? [
                    createSectionTitle("Languages"),
                    new Paragraph({
                        children: data.languages.map((l, i) => {
                            const name = typeof l === 'object' ? (l.name || l.language || '') : l;
                            const level = typeof l === 'object' ? (l.level || l.proficiency || '') : '';
                            return [
                                new TextRun({ text: name, bold: true, size: 20 }),
                                ...(level ? [new TextRun({ text: ` (${level})`, size: 18, color: "666666" })] : []),
                                ...(i < data.languages.length - 1 ? [new TextRun({ text: "  •  " })] : [])
                            ];
                        }).flat(),
                        spacing: { after: 200 },
                    }),
                ] : []),
            ],
        }],
    });

    return await Packer.toBuffer(doc);
};
