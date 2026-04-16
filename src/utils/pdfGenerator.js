import { jsPDF } from 'jspdf';

/**
 * Gera um PDF profissional para Receita ou Pedido de Exame
 * @param {Object} data - Dados do agendamento e prontuário
 * @param {string} tipo - 'RECEITA' | 'EXAMES'
 */
export const generateClinicPDF = (data, tipo = 'RECEITA') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // --- CABEÇALHO ---
  doc.setFillColor(139, 92, 246); // Primária (#8b5cf6)
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('CLÍNICA VITA', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Centro Médico de Excelência Especializada', 20, 32);
  
  // --- INFORMAÇÕES DO PROFISSIONAL ---
  doc.setTextColor(255, 255, 255);
  doc.text(`Dr(a). ${data.profissional_nome}`, pageWidth - 20, 25, { align: 'right' });
  doc.text(data.especialidade || 'Médico(a) Especialista', pageWidth - 20, 32, { align: 'right' });

  // --- CORPO ---
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const titulo = tipo === 'RECEITA' ? 'RECEITUÁRIO MÉDICO' : 'SOLICITAÇÃO DE EXAMES';
  doc.text(titulo, pageWidth / 2, 60, { align: 'center' });
  
  // Divisor
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 65, pageWidth - 20, 65);

  // Dados do Paciente
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Paciente:', 20, 75);
  doc.setFont('helvetica', 'normal');
  doc.text(data.cliente_nome, 45, 75);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Data:', pageWidth - 60, 75);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('pt-BR'), pageWidth - 45, 75);

  // Conteúdo Principal
  const conteudo = tipo === 'RECEITA' ? data.prescricoes : data.exames;
  doc.setFontSize(12);
  const splitText = doc.splitTextToSize(conteudo || 'Nenhum registro informado.', pageWidth - 40);
  doc.text(splitText, 20, 95);

  // --- RODAPÉ ---
  const footerY = doc.internal.pageSize.getHeight() - 30;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, footerY, pageWidth - 20, footerY);
  
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Este documento possui validade legal e assinatura eletrônica.', pageWidth / 2, footerY + 10, { align: 'center' });
  doc.text('Av. Paulista, 1000 - São Paulo, SP | (11) 98888-8888 | www.clinicavita.com.br', pageWidth / 2, footerY + 16, { align: 'center' });

  // Nome do arquivo
  const filename = `${tipo.toLowerCase()}_${data.cliente_nome.replace(' ', '_')}.pdf`;
  doc.save(filename);
};
