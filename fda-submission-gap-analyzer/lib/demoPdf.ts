import { jsPDF } from 'jspdf';

/** Minimal demo PDFs for citation traceability (Latin text; highlights align to fixed layout). */
export function createDemoCitationPdf(citationKey: string): Blob {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const margin = 18;
  let y = margin;

  const addTitle = (t: string) => {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(t, margin, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
  };

  const addPara = (lines: string[]) => {
    lines.forEach((line) => {
      const parts = doc.splitTextToSize(line, 170);
      doc.text(parts, margin, y);
      y += parts.length * 5 + 2;
    });
    y += 4;
  };

  switch (citationKey) {
    case 'cfr-314-50a':
      addTitle('21 CFR 314.50 — Content and format of an application');
      addPara([
        '(a) Applications under this section shall include:',
        '(1) An application form, which shall contain the name and address of the applicant, the date of the application, and the name of the drug product for which approval is sought.',
        '(2) A statement that the applicant has complied with the requirements of paragraph (b) of this section.',
      ]);
      break;
    case 'fdca-306k':
      addTitle('FD&C Act Section 306(k)(1) — Debarment certification');
      addPara([
        'Applicants must submit a certification that the applicant did not and will not use in any capacity the services of any debarred person in connection with the application.',
      ]);
      break;
    case 'cfr-part-54':
      addTitle('21 CFR Part 54 — Financial disclosure');
      addPara([
        'Clinical investigators must submit Form FDA 3454 or 3455 as applicable to disclose financial interests related to the clinical study.',
      ]);
      break;
    case 'bimo-guidance':
      addTitle('FDA BIMO — Bioresearch Monitoring');
      addPara([
        'Sponsors must provide data listings that support site selection and inspection planning for clinical investigator sites.',
      ]);
      break;
    case 'fda-effectiveness-guidance':
      addTitle('FDA Guidance — Clinical evidence of effectiveness');
      addPara([
        'Pivotal studies should provide substantial evidence of effectiveness, including adequate and well-controlled investigations.',
      ]);
      break;
    case 'fda-oncology-endpoints':
      addTitle('FDA Guidance — Oncology clinical trial endpoints');
      addPara([
        'Overall survival (OS) may be a key endpoint; progression-free survival (PFS) may be acceptable with justification depending on the disease setting.',
      ]);
      break;
    case 'ich-e5':
      addTitle('ICH E5(R1) — Ethnic factors');
      addPara([
        'The acceptability of foreign clinical data depends on bridging to the population for which approval is sought, including PK/PD and clinical relevance.',
      ]);
      break;
    case 'ich-e9':
      addTitle('ICH E9 — Statistical principles');
      addPara([
        'Statistical methods should be pre-specified; handling of missing data should be justified and aligned with the SAP.',
      ]);
      break;
    default:
      addTitle('Reference excerpt');
      addPara(['This is a placeholder excerpt for citation traceability in the demo.']);
  }

  return doc.output('blob');
}
