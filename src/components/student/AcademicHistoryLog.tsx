import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  FileDown,
  FilePlus2,
  Award,
  Stamp,
  Share2,
  Mail,
  Clock,
  CheckCircle2,
  Filter,
  Download,
  Lock,
  ArrowUpDown,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export type AcademicStatusChangeType =
  | 'Record Created'
  | 'Verified'
  | 'PDF Downloaded'
  | 'Grades Moderated'
  | 'Transcript Stamped'
  | 'Registry Shared'
  | 'Emailed'
  | 'Credit Evaluated';

export interface AcademicHistoryLogEntry {
  id: string;
  timestamp: string;
  statusChange: AcademicStatusChangeType;
  category: 'Milestone' | 'Authentication' | 'Export' | 'Senate Review' | 'Security';
  actor: string;
  ipAddress?: string;
  documentRef?: string;
  details: string;
  isLatest?: boolean;
}

export interface AcademicHistoryLogProps {
  logs: AcademicHistoryLogEntry[];
  currentStatus?: string;
  documentRef?: string;
  studentName?: string;
  studentId?: string;
  className?: string;
}

export const AcademicHistoryLog: React.FC<AcademicHistoryLogProps> = ({
  logs,
  currentStatus = 'Verified',
  documentRef = 'BIBU-TRN-2026-048',
  studentName = 'Candidate Name',
  studentId = 'BIBU-ST-2026',
  className = ''
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Status configuration mappings
  const getStatusBadge = (status: AcademicStatusChangeType) => {
    switch (status) {
      case 'Record Created':
        return {
          icon: FilePlus2,
          bgColor: 'bg-blue-50 text-blue-800 border-blue-200',
          dotColor: 'bg-blue-600',
          borderLeft: 'border-l-blue-600',
          badgeText: 'Record Created'
        };
      case 'Verified':
        return {
          icon: ShieldCheck,
          bgColor: 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold',
          dotColor: 'bg-emerald-600',
          borderLeft: 'border-l-emerald-600',
          badgeText: 'Verified'
        };
      case 'PDF Downloaded':
        return {
          icon: FileDown,
          bgColor: 'bg-indigo-50 text-indigo-900 border-indigo-200',
          dotColor: 'bg-indigo-600',
          borderLeft: 'border-l-indigo-600',
          badgeText: 'PDF Downloaded'
        };
      case 'Grades Moderated':
        return {
          icon: Award,
          bgColor: 'bg-purple-50 text-purple-900 border-purple-200',
          dotColor: 'bg-purple-600',
          borderLeft: 'border-l-purple-600',
          badgeText: 'Grades Moderated'
        };
      case 'Transcript Stamped':
        return {
          icon: Stamp,
          bgColor: 'bg-amber-50 text-amber-900 border-amber-300',
          dotColor: 'bg-amber-600',
          borderLeft: 'border-l-amber-600',
          badgeText: 'Transcript Stamped'
        };
      case 'Registry Shared':
        return {
          icon: Share2,
          bgColor: 'bg-teal-50 text-teal-900 border-teal-200',
          dotColor: 'bg-teal-600',
          borderLeft: 'border-l-teal-600',
          badgeText: 'Registry Shared'
        };
      case 'Emailed':
        return {
          icon: Mail,
          bgColor: 'bg-sky-50 text-sky-900 border-sky-200',
          dotColor: 'bg-sky-600',
          borderLeft: 'border-l-sky-600',
          badgeText: 'Emailed'
        };
      default:
        return {
          icon: History,
          bgColor: 'bg-slate-100 text-slate-800 border-slate-200',
          dotColor: 'bg-slate-500',
          borderLeft: 'border-l-slate-500',
          badgeText: status
        };
    }
  };

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (filterType === 'all') return true;
    if (filterType === 'milestones') {
      return log.statusChange === 'Record Created' || log.statusChange === 'Grades Moderated' || log.statusChange === 'Verified';
    }
    if (filterType === 'exports') {
      return log.statusChange === 'PDF Downloaded' || log.statusChange === 'Emailed' || log.statusChange === 'Registry Shared';
    }
    return log.statusChange === filterType;
  });

  // Sort logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.id.localeCompare(b.id);
    }
    return b.id.localeCompare(a.id);
  });

  return (
    <div
      className={`no-print bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#002366] text-[#C5A059] flex items-center justify-center shrink-0 shadow-2xs">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-display text-[#002366]">
                Academic History Log
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                AUDIT LEDGER
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Chronological ledger of official status changes, senate moderations, registrar validations, and downloads.
            </p>
          </div>
        </div>

        {/* Current State & Summary Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Current Status: {currentStatus}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            title={isCollapsed ? 'Expand Log' : 'Collapse Log'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Controls Bar: Filters and Sorting */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-medium text-[11px] mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Filter:
              </span>
              {[
                { id: 'all', label: 'All Events' },
                { id: 'milestones', label: 'Major Status Changes' },
                { id: 'Verified', label: 'Verifications' },
                { id: 'PDF Downloaded', label: 'PDF Downloads' },
                { id: 'exports', label: 'Dispatches & Shares' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterType(tab.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    filterType === tab.id
                      ? 'bg-[#002366] text-white shadow-2xs font-bold'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                title="Toggle timeline order"
              >
                <ArrowUpDown className="w-3 h-3" />
                <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
              </button>
              <span className="text-slate-400">({sortedLogs.length} events)</span>
            </div>
          </div>

          {/* Chronological Vertical Timeline View */}
          <div className="relative pl-6 sm:pl-8 space-y-4 pt-2 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {sortedLogs.map((entry, index) => {
              const badge = getStatusBadge(entry.statusChange);
              const Icon = badge.icon;
              const isFirst = index === 0 && sortOrder === 'desc';

              return (
                <div
                  key={entry.id}
                  className={`relative group transition-all duration-200`}
                >
                  {/* Timeline Connecting Node */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 border-white shadow-xs flex items-center justify-center ${badge.dotColor} text-white z-10`}
                  >
                    <Icon className="w-3 h-3" />
                  </div>

                  {/* Card Container */}
                  <div
                    className={`p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#002366]/40 hover:shadow-xs transition-all ${
                      isFirst ? 'border-emerald-300 bg-emerald-50/20' : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1.5 border-b border-slate-200/60">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Major Status Change Pill */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border shadow-2xs ${badge.bgColor}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{badge.badgeText}</span>
                        </span>

                        {isFirst && (
                          <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                            LATEST STATUS
                          </span>
                        )}

                        <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {entry.category}
                        </span>
                      </div>

                      {/* Timestamp & Relative Indicator */}
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">{entry.timestamp}</span>
                      </div>
                    </div>

                    {/* Narrative Description & Details */}
                    <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                      {entry.details}
                    </p>

                    {/* Metadata Footer: Actor, Security Hash, IP/Ref */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
                      <div className="flex items-center gap-2">
                        <span>
                          Signatory/Actor: <strong className="text-slate-800">{entry.actor}</strong>
                        </span>
                        {entry.ipAddress && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500">{entry.ipAddress}</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>Ref: <strong className="text-[#002366]">{entry.documentRef || documentRef}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ledger Verification Footer Note */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9.5px] font-mono text-slate-400">
            <span>OFFICIAL CENTRAL REGISTRAR IMMUTABLE TRANSCRIPT LOG • PHOENIX, AZ</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>CRYPTOGRAPHICALLY AUDITED & VERIFIED</span>
            </span>
          </div>
        </>
      )}
    </div>
  );
};
