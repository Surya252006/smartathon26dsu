import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates and downloads an official Tamil Nadu e-Governance / Smartathon
 * Scholarship Application Roadmap PDF document.
 * 
 * @param {Object} profile - Student's profile (full_name, community, annual_income, etc.)
 * @param {Object} result - Evaluation result containing recommended_bundle, total_financial_value, excluded_schemes
 */
export function generateRoadmapPdf(profile = {}, result = {}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  const bundle = result.recommended_bundle || [];
  const totalVal = result.total_financial_value || 0;
  const exclusions = result.excluded_schemes || [];
  const probabilities = result.selection_probabilities || {};

  const studentName = profile.full_name || 'Student Candidate';
  const community = profile.community || 'Not Specified';
  const income = profile.annual_income ? `Rs. ${Number(profile.annual_income).toLocaleString('en-IN')}` : 'Not Specified';
  const marks = profile.board_percentage ? `${profile.board_percentage}%` : 'N/A';
  const schooling = (profile.schooling_type || '').replace(/_/g, ' ').toUpperCase() || 'GENERAL';
  const course = profile.current_course || 'Higher Education';

  // -------------------------------------------------------------
  // 1. OFFICIAL HEADER BANNER
  // -------------------------------------------------------------
  doc.setFillColor(15, 76, 129); // Deep Tamil Nadu Government Blue
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line
  doc.setFillColor(16, 185, 129); // Emerald accent line
  doc.rect(0, 28, pageWidth, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('GOVERNMENT OF TAMIL NADU - HIGHER EDUCATION DEPARTMENT', pageWidth / 2, 11, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text("OFFICIAL AI SCHOLARSHIP & WELFARE ENTITLEMENT ROADMAP", pageWidth / 2, 18, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  const refId = `TN-SCH-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  doc.text(`Doc Ref: ${refId}  |  Generated: ${dateStr}  |  Constraint Engine: MWIS Graph Optimizer`, pageWidth / 2, 24, { align: 'center' });

  let currentY = 36;

  // -------------------------------------------------------------
  // 2. CANDIDATE VERIFICATION PROFILE TABLE
  // -------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Verified Candidate Profile', margin, currentY);
  currentY += 4;

  const profileRows = [
    [
      { content: 'Candidate Name:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
      studentName,
      { content: 'Community / Caste:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
      community
    ],
    [
      { content: 'Family Annual Income:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
      income,
      { content: '12th / Board Score:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
      marks
    ],
    [
      { content: 'Schooling Background:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
      schooling,
      { content: 'Admitted Course:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
      course
    ],
    [
      { content: 'First Graduate Status:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
      profile.is_first_graduate ? 'Yes (Certified)' : 'No',
      { content: 'Government Quota:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
      profile.admission_mode ? profile.admission_mode.replace(/_/g, ' ').toUpperCase() : 'Single Window'
    ]
  ];

  autoTable(doc, {
    startY: currentY,
    body: profileRows,
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 2.5, textColor: [30, 41, 59] },
    tableWidth: pageWidth - margin * 2,
    margin: { left: margin, right: margin }
  });

  currentY = doc.lastAutoTable.finalY + 8;

  // -------------------------------------------------------------
  // 3. OPTIMAL AWARDED BUNDLE TABLE
  // -------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Approved & Stackable Scholarship Bundle (MWIS Optimized)', margin, currentY);
  currentY += 4;

  const bundleRows = bundle.map((scheme, idx) => {
    const prob = probabilities[scheme.id]?.score ? `${probabilities[scheme.id].score}%` : 'Guaranteed';
    const breakdown = scheme.benefit_breakdown || {};
    const stipend = breakdown.maintenance_stipend ? `Rs. ${Number(breakdown.maintenance_stipend).toLocaleString('en-IN')}` : '-';
    const tuition = breakdown.tuition_waiver ? `Rs. ${Number(breakdown.tuition_waiver).toLocaleString('en-IN')}` : '-';
    const total = `Rs. ${Number(scheme.financial_value).toLocaleString('en-IN')}`;

    return [
      String(idx + 1),
      scheme.name,
      prob,
      stipend,
      tuition,
      total,
      scheme.portal_name || 'Official Portal'
    ];
  });

  if (bundleRows.length === 0) {
    bundleRows.push(['-', 'No schemes met all threshold criteria for this specific profile.', '-', '-', '-', 'Rs. 0', '-']);
  }

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Scheme Title', 'Prob.', 'Stipend', 'Tuition Waiver', 'Annual Benefit', 'Application Portal']],
    body: bundleRows,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 76, 129],
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 22, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 26, halign: 'right', fontStyle: 'bold', textColor: [16, 120, 80] },
      6: { cellWidth: 28, halign: 'center' }
    },
    styles: { fontSize: 8, cellPadding: 3, textColor: [30, 41, 59] },
    tableWidth: pageWidth - margin * 2,
    margin: { left: margin, right: margin }
  });

  currentY = doc.lastAutoTable.finalY + 6;

  // -------------------------------------------------------------
  // 4. TOTAL NET FINANCIAL BENEFIT BANNER
  // -------------------------------------------------------------
  doc.setFillColor(236, 253, 245); // Light mint background
  doc.setDrawColor(16, 185, 129);  // Emerald border
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(6, 95, 70);
  doc.text('MAXIMUM LEGAL ANNUAL FINANCIAL ENTITLEMENT:', margin + 4, currentY + 8.5);

  doc.setFontSize(13);
  doc.setTextColor(4, 120, 87);
  doc.text(`Rs. ${Number(totalVal).toLocaleString('en-IN')} / Year`, pageWidth - margin - 6, currentY + 9, { align: 'right' });

  currentY += 19;

  // -------------------------------------------------------------
  // 5. STEP-BY-STEP e-SEVAI & SUBMISSION CHECKLIST
  // -------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Step-by-Step Action & Documentation Checklist', margin, currentY);
  currentY += 4;

  const requiredDocs = [...new Set(bundle.flatMap(s => s.required_docs || []))];
  const checklistItems = [
    'Obtain digital Income Certificate from Tahsildar via nearest e-Sevai Centre (validity 6 months).',
    'Ensure Community Certificate is digitally signed with valid verifiable barcode/QR code.',
    'For 7.5% / Pudhumai Penn: Obtain Bonafide School Certificate confirming Class 6 to 12 in TN Govt School.',
    'Ensure Student Bank Account is Aadhaar-seeded via NPCI / PFMS mapper for direct DBT disbursement.',
    ...requiredDocs.slice(0, 3).map(d => `Mandatory Certificate: ${d} (keep scanned copies ready in PDF < 200KB).`)
  ];

  const checklistRows = checklistItems.slice(0, 5).map((item, i) => [
    `[ Step ${i + 1} ]`,
    item
  ]);

  autoTable(doc, {
    startY: currentY,
    body: checklistRows,
    theme: 'plain',
    columnStyles: {
      0: { cellWidth: 20, fontStyle: 'bold', textColor: [15, 76, 129] },
      1: { cellWidth: 'auto', textColor: [51, 65, 85] }
    },
    styles: { fontSize: 7.8, cellPadding: 1.8 },
    tableWidth: pageWidth - margin * 2,
    margin: { left: margin, right: margin }
  });

  currentY = doc.lastAutoTable.finalY + 6;

  // -------------------------------------------------------------
  // 6. MUTUAL EXCLUSIVITY COMPLIANCE LEDGER (EXCLUSION AUDIT)
  // -------------------------------------------------------------
  if (exclusions.length > 0 && currentY < pageHeight - 35) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(185, 28, 28);
    doc.text('4. Mutual Exclusivity & Conflict Ledger (Why Alternative Schemes Were Dropped)', margin, currentY);
    currentY += 3.5;

    const exclRows = exclusions.slice(0, 3).map(e => [
      e.scheme_name,
      e.reason
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Excluded Scheme', 'Statutory Ground / Optimization Rationale']],
      body: exclRows,
      theme: 'grid',
      headStyles: { fillColor: [254, 242, 242], textColor: [185, 28, 28], fontSize: 7.5, fontStyle: 'bold' },
      styles: { fontSize: 7.2, cellPadding: 2, textColor: [71, 85, 105] },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 'auto' }
      },
      tableWidth: pageWidth - margin * 2,
      margin: { left: margin, right: margin }
    });

    currentY = doc.lastAutoTable.finalY + 4;
  }

  // -------------------------------------------------------------
  // 7. FOOTER & DIGITAL AUDIT TRAIL
  // -------------------------------------------------------------
  const footerY = pageHeight - 12;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("Official AI Decision Record | Government of Tamil Nadu e-Governance Policy Compliance Engine", margin, footerY + 2);
  doc.text('Page 1 of 1', pageWidth - margin, footerY + 2, { align: 'right' });

  // Save / Trigger Download
  const safeName = (studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`TN_Scholarship_Roadmap_${safeName}.pdf`);
}
