import React, { useState, useMemo } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  CalendarCheck2,
  Calendar,
  Printer,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  PieChart,
  BarChart3,
  Award,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const RendicionBimestralView: React.FC = () => {
  const {
    getBimestralReport,
    settings,
    currentUser,
    incomes,
    expenses,
    sales,
  } = usePOS();

  const currentYear = new Date().getFullYear();
  // Current month 0-indexed: 0-1 => bim 1, 2-3 => bim 2, etc.
  const currentBimester = Math.floor(new Date().getMonth() / 2) + 1;

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedBimester, setSelectedBimester] = useState<number>(currentBimester);

  // Generate current bimester report
  const currentReport = useMemo(() => {
    return getBimestralReport(selectedYear, selectedBimester);
  }, [getBimestralReport, selectedYear, selectedBimester]);

  // Generate previous bimester report for comparison
  const previousReport = useMemo(() => {
    let prevBim = selectedBimester - 1;
    let prevYear = selectedYear;
    if (prevBim < 1) {
      prevBim = 6;
      prevYear = selectedYear - 1;
    }
    return getBimestralReport(prevYear, prevBim);
  }, [getBimestralReport, selectedYear, selectedBimester]);

  // Percentage variations
  const calcVariation = (current: number, prev: number) => {
    if (prev === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - prev) / prev) * 1000) / 10;
  };

  const salesVariation = calcVariation(currentReport.totalSales, previousReport.totalSales);
  const expenseVariation = calcVariation(currentReport.totalExpense, previousReport.totalExpense);
  const netProfitVariation = calcVariation(currentReport.netProfit, previousReport.netProfit);

  // Breakdown of expenses in bimester by category
  const bimesterCategoryExpenses = useMemo(() => {
    const map: Record<string, number> = {};
    expenses
      .filter(
        (e) =>
          e.status === 'active' &&
          e.date >= currentReport.startDate &&
          e.date <= currentReport.endDate
      )
      .forEach((e) => {
        map[e.category] = (map[e.category] || 0) + e.amount;
      });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses, currentReport.startDate, currentReport.endDate]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const content = `ARYDALY - RENDICIÓN DE CUENTAS BIMESTRAL
Empresa: "${settings.name}"
Bimestre: ${currentReport.bimesterName} (${currentReport.year})
Periodo: ${currentReport.startDate} al ${currentReport.endDate}
Emitido por: "${currentUser?.fullName || 'Administrador'}"
Fecha de Emisión: ${new Date().toLocaleDateString('es-MX')}

CONCEPTO,MONTO
Capital Inicial del Período,${currentReport.initialCapital}
Ingresos Totales del Bimestre,${currentReport.totalIncome}
Ventas Totales,${currentReport.totalSales}
Costo de Mercancía Vendida (COGS),${currentReport.costOfGoodsSold}
GANANCIA BRUTA,${currentReport.grossProfit}
Gastos Operativos,${currentReport.operatingExpenses}
GANANCIA NETA,${currentReport.netProfit}
Egresos Totales del Bimestre,${currentReport.totalExpense}
CAPITAL FINAL DEL PERÍODO,${currentReport.finalCapital}
Margen de Ganancia Neta (%),${currentReport.profitMarginPercent}%
Número de Ventas Concretadas,${currentReport.salesCount}
`;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ARYDALY-Rendicion-${currentReport.year}-Bim${currentReport.bimester}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-100 print:bg-white print:p-0">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Rendición de Cuentas Bimestral
              </h1>
              <p className="text-xs text-slate-500">
                Auditoría financiera y evaluación integral de desempeño cada 2 meses en {settings.name}
              </p>
            </div>
          </div>
        </div>

        {/* Year and Bimester Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={2026}>Año 2026</option>
            <option value={2025}>Año 2025</option>
          </select>

          <select
            value={selectedBimester}
            onChange={(e) => setSelectedBimester(parseInt(e.target.value))}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={1}>Bimestre 1: Ene - Feb</option>
            <option value={2}>Bimestre 2: Mar - Abr</option>
            <option value={3}>Bimestre 3: May - Jun</option>
            <option value={4}>Bimestre 4: Jul - Ago</option>
            <option value={5}>Bimestre 5: Sep - Oct</option>
            <option value={6}>Bimestre 6: Nov - Dic</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Formato Oficial</span>
          </button>
        </div>
      </div>

      {/* OFFICIAL REPORT SHEET (Printable & on screen) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-8 print:border-none print:shadow-none print:p-2">
        {/* ARYDALY Official Header */}
        <div className="border-b-2 border-slate-900 pb-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xl">
              AD
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                {settings.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                SISTEMA ADMINISTRATIVO Y FINANCIERO — INFORME OFICIAL
              </p>
            </div>
          </div>

          <div className="text-left md:text-right text-xs space-y-0.5">
            <div className="font-extrabold text-sm text-indigo-700 uppercase tracking-wide">
              {currentReport.bimesterName} {currentReport.year}
            </div>
            <div className="text-slate-500">
              Período: <span className="font-semibold text-slate-700">{currentReport.startDate}</span> al{' '}
              <span className="font-semibold text-slate-700">{currentReport.endDate}</span>
            </div>
            <div className="text-slate-400 text-[10px]">
              Emitido por: {currentUser?.fullName || 'Administrador ARYDALY'}
            </div>
          </div>
        </div>

        {/* Executive Summary Hero Tiles (Section 14) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500">Capital Inicial</span>
            <p className="text-xl font-black font-mono text-slate-800 mt-1">
              {settings.currencySymbol}
              {currentReport.initialCapital.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-slate-400">Saldo de arranque</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-700">Ingresos Totales</span>
            <p className="text-xl font-black font-mono text-emerald-700 mt-1">
              +{settings.currencySymbol}
              {currentReport.totalIncome.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-emerald-600">Ventas + otros ingresos</span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
            <span className="text-[10px] uppercase font-bold text-rose-700">Egresos Totales</span>
            <p className="text-xl font-black font-mono text-rose-700 mt-1">
              -{settings.currencySymbol}
              {currentReport.totalExpense.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-rose-600">Compras + gastos</span>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-[10px] uppercase font-bold text-blue-700">Capital Final</span>
            <p className="text-xl font-black font-mono text-blue-700 mt-1">
              {settings.currencySymbol}
              {currentReport.finalCapital.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-blue-600">Capital inicial + Ingresos - Egresos</span>
          </div>
        </div>

        {/* SECTION 14 & 15: DESGLOSE DE GANANCIAS Y COMPARACIÓN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Detailed Statement of Profit (Desglose de Ganancias) */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Estado de Ganancias del Bimestre</span>
              </h3>
              <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                Margen Neto: {currentReport.profitMarginPercent}%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="font-semibold text-slate-700">Ventas Totales del Período ({currentReport.salesCount} ventas):</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {settings.currencySymbol}{currentReport.totalSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 text-slate-600 pl-4 border-l-2 border-slate-200">
                <span>(-) Costo de los Productos Vendidos (COGS):</span>
                <span className="font-mono font-bold text-rose-600">
                  -{settings.currencySymbol}{currentReport.costOfGoodsSold.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 px-3 bg-emerald-50/70 rounded-xl font-bold text-emerald-900">
                <span>(=) GANANCIA BRUTA:</span>
                <span className="font-mono text-base text-emerald-700">
                  {settings.currencySymbol}{currentReport.grossProfit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 text-slate-600 pl-4 border-l-2 border-slate-200">
                <span>(-) Gastos Operativos (Luz, Renta, Nómina, etc.):</span>
                <span className="font-mono font-bold text-rose-600">
                  -{settings.currencySymbol}{currentReport.operatingExpenses.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 px-3 bg-indigo-50 rounded-xl font-black text-indigo-950 border border-indigo-200/60">
                <div className="flex flex-col">
                  <span className="text-xs">(=) GANANCIA NETA DEL NEGOCIO:</span>
                  <span className="text-[10px] text-indigo-700 font-normal">
                    Ganancia Bruta - Gastos Operativos
                  </span>
                </div>
                <span className="font-mono text-lg text-indigo-700">
                  {settings.currencySymbol}{currentReport.netProfit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Section 15: Comparación entre Períodos (Bimestre Actual vs Anterior) */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>Comparación: Bimestre Actual vs Anterior</span>
              </h3>
              <span className="text-[10px] font-semibold text-slate-400">
                vs {previousReport.bimesterName} {previousReport.year}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Sales variation */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-700">Ventas Totales</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Actual: {settings.currencySymbol}{currentReport.totalSales} | Prev: {settings.currencySymbol}{previousReport.totalSales}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 font-bold font-mono text-sm px-2.5 py-1 rounded-lg ${
                    salesVariation >= 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {salesVariation >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span>{salesVariation >= 0 ? '+' : ''}{salesVariation}%</span>
                </div>
              </div>

              {/* Expense variation */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-700">Egresos Totales</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Actual: {settings.currencySymbol}{currentReport.totalExpense} | Prev: {settings.currencySymbol}{previousReport.totalExpense}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 font-bold font-mono text-sm px-2.5 py-1 rounded-lg ${
                    expenseVariation <= 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <span>{expenseVariation >= 0 ? '+' : ''}{expenseVariation}%</span>
                </div>
              </div>

              {/* Net profit variation */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-700">Ganancia Neta</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Actual: {settings.currencySymbol}{currentReport.netProfit} | Prev: {settings.currencySymbol}{previousReport.netProfit}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 font-bold font-mono text-sm px-2.5 py-1 rounded-lg ${
                    netProfitVariation >= 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {netProfitVariation >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span>{netProfitVariation >= 0 ? '+' : ''}{netProfitVariation}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses by Category Breakdown in Bimester */}
        <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
            Distribución de Egresos por Categoría en el Bimestre
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bimesterCategoryExpenses.length === 0 ? (
              <p className="text-xs text-slate-400 col-span-3">
                No hay egresos registrados en este bimestre.
              </p>
            ) : (
              bimesterCategoryExpenses.map(([catName, catTotal]) => (
                <div
                  key={catName}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-700">{catName}</span>
                  <span className="font-mono font-bold text-rose-700">
                    {settings.currencySymbol}{catTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Audit Signatures for Print */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-500">
          <div className="space-y-8">
            <div className="border-b border-slate-300 w-48 mx-auto" />
            <p>Firma del Administrador General</p>
          </div>
          <div className="space-y-8">
            <div className="border-b border-slate-300 w-48 mx-auto" />
            <p>Firma del Responsable Financiero</p>
          </div>
        </div>
      </div>
    </div>
  );
};
