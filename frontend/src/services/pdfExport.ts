import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Itinerary, TripPreferences } from '../types/itinerary';

export const exportItineraryToPDF = (itinerary: Itinerary, preferences?: TripPreferences) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor: [number, number, number] = [15, 23, 42]; // Slate 900
  const tealColor: [number, number, number] = [13, 148, 136]; // Teal 600

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 42, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('TravelGenie', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text('Personalized AI Travel Itinerary', 14, 25);

  // Destination & Dates right-aligned
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(itinerary.destination, 196, 18, { align: 'right' });

  if (preferences) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text(`${preferences.startDate} to ${preferences.endDate} (${preferences.travelers} Travelers)`, 196, 25, { align: 'right' });
  }

  // Accent Line
  doc.setFillColor(...tealColor);
  doc.rect(0, 42, 210, 2, 'F');

  let currentY = 52;

  // Trip Summary Box
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(itinerary.tripTitle, 14, currentY);

  currentY += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(71, 85, 105); // Slate 600
  const summaryLines = doc.splitTextToSize(itinerary.summary, 182);
  doc.text(summaryLines, 14, currentY);
  currentY += summaryLines.length * 5 + 4;

  // Quick Stats
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, currentY, 182, 16, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...tealColor);
  doc.text('Total Estimated Budget:', 18, currentY + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...primaryColor);
  doc.text(`${itinerary.currency} ${itinerary.totalEstimatedBudget.toLocaleString()}`, 62, currentY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...tealColor);
  doc.text('Travel Pace:', 105, currentY + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...primaryColor);
  doc.text(itinerary.travelPace || 'Balanced', 128, currentY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...tealColor);
  doc.text('Travel Style:', 18, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...primaryColor);
  doc.text(itinerary.travelStyle || 'Leisure', 40, currentY + 12);

  currentY += 22;

  // Day-by-Day Schedules
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Day-by-Day Schedule', 14, currentY);
  currentY += 4;

  itinerary.days.forEach((day) => {
    const tableData = day.activities.map((act) => [
      act.time,
      act.period,
      act.name + '\n' + act.description,
      `${itinerary.currency} ${act.estimatedCost}`,
      act.transportSuggestion || '-',
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [[`Day ${day.day}: ${day.title} (${day.date})`, 'Period', 'Activity & Details', 'Est. Cost', 'Transit']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 8.5,
        cellPadding: 3,
        overflow: 'linebreak',
      },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 20 },
        2: { cellWidth: 90 },
        3: { cellWidth: 24 },
        4: { cellWidth: 26 },
      },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 6;

    // Check if new page needed
    if (currentY > 260) {
      doc.addPage();
      currentY = 20;
    }
  });

  // Budget Breakdown Table
  if (currentY > 220) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Estimated Expense Breakdown', 14, currentY);
  currentY += 4;

  const b = itinerary.budgetBreakdown;
  const budgetData = [
    ['Transportation', `${itinerary.currency} ${b.transportation.toLocaleString()}`],
    ['Accommodation', `${itinerary.currency} ${b.accommodation.toLocaleString()}`],
    ['Food & Dining', `${itinerary.currency} ${b.food.toLocaleString()}`],
    ['Activities & Entry Tickets', `${itinerary.currency} ${b.activities.toLocaleString()}`],
    ['Miscellaneous & Shopping', `${itinerary.currency} ${b.miscellaneous.toLocaleString()}`],
    ['Total Estimated Trip Cost', `${itinerary.currency} ${itinerary.totalEstimatedBudget.toLocaleString()}`],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['Category', 'Estimated Amount']],
    body: budgetData,
    theme: 'grid',
    headStyles: { fillColor: tealColor, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 82 },
    },
    margin: { left: 14, right: 14 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Travel Tips & Packing Suggestions
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Essential Travel Tips:', 14, currentY);
  currentY += 5;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  itinerary.travelTips.forEach((tip) => {
    doc.text(`• ${tip}`, 16, currentY);
    currentY += 4.5;
  });

  // Footer Disclaimer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text(
    'Notice: All estimates (costs, durations, weather) are generated for planning purposes. Always verify timings and bookings directly.',
    14,
    290
  );

  doc.save(`${itinerary.destination.replace(/[^a-zA-Z0-9]/g, '_')}_TravelGenie_Itinerary.pdf`);
};

