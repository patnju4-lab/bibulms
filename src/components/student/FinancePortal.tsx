import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Download,
  ArrowLeft,
  ShieldCheck,
  Building,
  Sparkles
} from 'lucide-react';
import { Invoice } from '../../types';

export const FinancePortal: React.FC = () => {
  const { invoices, payInvoice, currentUser, setCurrentView } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('David Emmanuel');

  const pendingInvoices = invoices.filter((i) => i.status === 'Pending');
  const paidInvoices = invoices.filter((i) => i.status === 'Paid');

  const totalBilled = invoices.reduce((acc, i) => acc + i.amountUSD, 0);
  const totalPaid = paidInvoices.reduce((acc, i) => acc + i.amountUSD, 0);
  const currentBalance = totalBilled - totalPaid;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    payInvoice(selectedInvoice.id);
    setPaymentSuccess(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('student-dashboard')}
          className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#002366] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>

        <div className="text-xs text-slate-500 font-mono">
          Student Account: <strong>{currentUser.studentId}</strong>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] uppercase font-black tracking-wider text-slate-500">Total Program Invoiced</div>
          <div className="text-3xl font-black font-display text-[#002366]">${totalBilled}.00 USD</div>
          <div className="text-[11px] text-slate-500">Degree Tuition & Institutional Fees</div>
        </div>

        <div className="p-6 rounded-xl bg-emerald-50/70 border border-emerald-200 shadow-xs space-y-1">
          <div className="text-[11px] uppercase font-black tracking-wider text-emerald-800">Total Payments Cleared</div>
          <div className="text-3xl font-black font-display text-emerald-700">${totalPaid}.00 USD</div>
          <div className="text-[11px] text-emerald-800">Verified by University Bursar</div>
        </div>

        <div className="p-6 rounded-xl bg-[#002366] text-white shadow-xs space-y-2 border border-[#002366]">
          <div className="text-[11px] uppercase font-black tracking-wider text-[#C5A059]">Outstanding Balance Due</div>
          <div className="text-3xl font-black font-display text-white">${currentBalance}.00 USD</div>
          <div className="text-[11px] text-slate-300">
            {currentBalance === 0 ? '✓ Account Fully Cleared' : 'Due for Fall 2026 Registration'}
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold font-display text-[#002366]">
            Tuition & Academic Invoices
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {invoices.length} Registered Invoices
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F9FB] text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#F8F9FB]">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{inv.description}</td>
                  <td className="py-3 px-4 font-bold text-[#002366] font-mono">${inv.amountUSD}.00 USD</td>
                  <td className="py-3 px-4 text-slate-600">{inv.dueDate}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                      inv.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-[#C5A059]/20 text-[#002366]'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {inv.status === 'Pending' ? (
                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setPaymentSuccess(false);
                        }}
                        className="px-4 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black uppercase tracking-wider text-xs shadow-xs"
                      >
                        Pay Online →
                      </button>
                    ) : (
                      <button
                        onClick={() => alert(`Official Bursar Receipt for ${inv.invoiceNumber} downloaded.`)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase tracking-wider text-xs flex items-center gap-1 ml-auto"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 border border-slate-200">
            {paymentSuccess ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold font-display text-[#002366]">
                  Payment Processed Successfully!
                </h3>
                <p className="text-xs text-slate-600">
                  Your payment of <strong>${selectedInvoice.amountUSD}.00 USD</strong> for invoice <strong>{selectedInvoice.invoiceNumber}</strong> has cleared.
                </p>
                <div className="p-3 bg-[#F8F9FB] rounded-xl border border-slate-200 text-xs text-slate-600 font-mono">
                  Bursar Authorization: TXN-AUTH-2026-9812
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="w-full py-2.5 rounded-lg bg-[#002366] text-white font-bold uppercase tracking-wider text-xs"
                >
                  Done & Return to Invoices
                </button>
              </div>
            ) : (
              <form onSubmit={handlePay} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold font-display text-[#002366]">
                    Settle University Tuition Invoice
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(null)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-3 bg-[#002366]/5 rounded-xl border border-[#002366]/10 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#002366] font-display">{selectedInvoice.description}</div>
                    <div className="text-[11px] text-slate-500">{selectedInvoice.invoiceNumber}</div>
                  </div>
                  <div className="text-base font-bold text-[#002366] font-mono">
                    ${selectedInvoice.amountUSD}.00 USD
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Cardholder Full Name</label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Card Number (Encrypted Gateway)</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#002366]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Expires</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">CVV / CVC</label>
                      <input
                        type="password"
                        defaultValue="882"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>256-Bit SSL University Bank Payment Terminal</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black uppercase tracking-wider text-xs shadow-xs transition-all"
                >
                  Authorize Payment of ${selectedInvoice.amountUSD}.00 USD
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
